# Benchmark baseline

Apple M1, Node 22.22.2 (arm64-darwin). Run `pnpm bench` to reproduce.

Pre-optim numbers come from the migrated state before any indexing —
`Array.find` / `Array.filter` / `Array.includes` over the parsed arrays.
Post-optim numbers come from `1.0.0` with `Map` / `Set` indexes built
once at module load.

## Post-optim (1.0.0)

### Lookup latency

| Bench                                    |  Pre-optim |  Post-optim |   Speedup |
| ---------------------------------------- | ---------: | ----------: | --------: |
| `findCountryByIso` (iso2, late hit)      |    4.19 µs |    10.33 ns |     405×  |
| `findCountryByIso` (iso3, late hit)      |    5.87 µs |    14.91 ns |     394×  |
| `findCountryByIso` (miss)                |  876.63 ns |    14.06 ns |      62×  |
| `findCountryByName` (exact, late hit)    |   29.59 µs |    12.06 ns |   2,454×  |
| `findCapitalOfCountryIso` (iso2, late)   |    4.12 µs |    10.25 ns |     402×  |
| `findTimezoneByCityName` (exact, late)   |  292.59 µs |    27.03 ns |  10,825×  |
| `findLocationsByCountryIso` (US)         |   70.59 µs |    20.36 ns |   3,468×  |
| `isValidCountryIso` (iso2 hit)           |  599.21 ns |     5.36 ns |     112×  |
| `isValidCountryIso` (iso3 hit)           |  303.21 ns |     4.77 ns |      64×  |
| `isValidCountryIso` (miss)               |  653.29 ns |     6.04 ns |     108×  |

`findTimezoneByCityName` is the largest gain — it used to scan the full
40,000-entry locations array; the lowercase-city Map resolves it in a
single hash lookup. `findLocationsByCountryIso` returns the pre-grouped
bucket array directly, skipping the per-location filter.

### Bundle size

Pre-optim shipped a single entry. The optim pass split the data layer
into per-domain modules and added subpath exports
(`@coroboros/location-timezone/{countries,locations,states-ansi,timezones}`);
tsdown auto-emits shared chunks. Consumers importing only one domain pull
only the chunks they need.

| Entry          |  Pre-optim |  Post-optim (loaded) |                                            Note |
| -------------- | ---------: | -------------------: | ----------------------------------------------: |
| `.` (full)     |  876.88 kB |             ~876 kB  |                merged surface, all chunks loaded |
| `/countries`   |        n/a |              ~85 kB  |                                     10× smaller |
| `/states-ansi` |        n/a |               ~5 kB  |                                     73× smaller |
| `/timezones`   |        n/a |             ~870 kB  | requires locations + countries for city lookups |
| `/locations`   |        n/a |             ~860 kB  |   requires countries for ISO validation helpers |

Gzip on the ESM main entry: pre-optim 202.57 kB, post-optim ~203 kB (the
sum of the chunks the main entry pulls).

## Why partial-match paths stay linear

`findLocationsByCountryName(_, partialMatch=true)`,
`findLocationsByProvince(_, partialMatch=true)`, and
`findLocationsByState(_, partialMatch=true)` use case-insensitive
substring matching. No `Map` / `Set` / `Trie` index helps that without
significant code or memory cost. The exact-match path of each function
uses the corresponding index; the partial path scans linearly.

`findLocationsByCoordinates` scans the locations array for a
bounding-box test — no good 2D index without an rtree or kd-tree
dependency, which would conflict with the zero-additional-runtime-dep
rule.

## Going-forward target

**No regression > 5% on any bucket at fixed feature set.** Hash-table
hits are nearly cache-line bound; variance is low enough to hold the bar
tight. Feature additions that legitimately cost time (an extra
indirection, a new validation step) reset the bar for the buckets they
affect — document the new floor here when that happens.
