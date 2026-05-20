# @coroboros/location-timezone

Lookup helpers for capitals, countries, cities, ANSI states (USA), and IANA timezones. Data is compressed JSON parsed once at module load, then indexed via `Map`/`Set` for O(1) lookups.

## Canonical rules

Follows the Coroboros engineering global rules. Repo-specific divergences are stated inline in `## Rules` below.

> **Public-repo hygiene:** this is shipped into a public community repo. Never reference private rule paths, local machine paths, or the migration recipe here — keep it generic.

## Tech Stack
- TypeScript strict, ES modules + CJS dual build (tsdown), multi-entry with subpath exports
- Vitest for tests, `fast-check` for property tests
- `mitata` for benchmarks (`pnpm bench`)
- `tsx` for `pnpm build:data`
- Biome for lint/format
- Node.js 22 LTS
- One runtime dependency: `zipson` (data decompression)

## Commands
- `pnpm build` — bundle ESM + CJS + types for the main entry and the four subpaths into `dist/`
- `pnpm build:data` — regenerate `src/data/*.json` from `scripts/data/{countries.csv,country-capitals.json,locations.json}` via `tsx scripts/clean-and-generate.ts`
- `pnpm test` — run the Vitest suite (109 tests, incl. property-based)
- `pnpm test:coverage` — same with `@vitest/coverage-v8`
- `pnpm lint` / `pnpm lint:fix` — Biome check
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm bench` — build then run `bench/location-timezone.bench.mjs`
- `pnpm dev` — `tsdown --watch`

## Important Files
- `src/index.ts` — main entry; named exports + default merged object
- `src/countries.ts`, `src/locations.ts`, `src/states-ansi.ts`, `src/timezones.ts` — per-domain query helpers; each is a public subpath entry (`@coroboros/location-timezone/<domain>`)
- `src/helpers.ts` — internal `exists`, `is`, `hasLen`, `match` (not exported publicly)
- `src/interfaces.ts` — `Capital`, `Country`, `Location`, `StateAnsi`
- `src/data/{countries,locations,states-ansi,timezones}.ts` — per-domain data layer: parses compressed JSON, freezes the arrays, builds Map/Set indexes
- `src/data/*.json` — compressed payloads (committed; not human-edited)
- `tests/` — Vitest suites, one spec per source module plus `location-timezone.property.test.ts` for fast-check invariants
- `bench/{location-timezone.bench.mjs,baseline.md}` — mitata bench + 1.0.0 baseline with regression budget
- `scripts/` — data rebuild scripts (TypeScript via `tsx`); NOT shipped on npm (not in `files`). Excluded from `biome` and `tsc`. Run via `pnpm build:data`.

## Public API (1.0.0 contract)
- 4 domains (capitals/countries, locations, states ANSI, timezones) across 29 functions
- 4 interfaces: `Capital`, `Country`, `Location`, `StateAnsi`
- Three import shapes:
  - Main entry named: `import { findCapitalOfCountryIso } from '@coroboros/location-timezone'`
  - Main entry default merged object: `import locationTimezone from '@coroboros/location-timezone'` then `.findX(...)`
  - Per-domain subpath: `import { findCountryByIso } from '@coroboros/location-timezone/countries'`

## Rules
- **NEVER** break the public API above. Signatures, return shapes, and `undefined`/`[]` "not found" semantics are the 1.0.0 contract.
- **NEVER** add a runtime dependency beyond `zipson` without user approval.
- **NEVER** use `axios`, `request`, or `node-fetch` — use native `fetch` (Node 22+).
- **NEVER** mutate the arrays returned from `getCountries`, `getCapitals`, `getLocations`, `getStatesAnsi`, `getTimezones`, `getCountryIso2Codes`, `getCountryIso3Codes` — they are frozen, shared references to internal data. Returned bucket arrays from `findLocationsByX` and `findTimezonesByX` are also frozen.
- Empty string `''` is the standard "absent" marker on `Capital`/`Country`/`Location`/`StateAnsi` string fields. Never substitute `null` or `undefined`.
- Run `pnpm lint && pnpm typecheck && pnpm test` before every commit. Run `pnpm bench` against `bench/baseline.md` when touching `src/{countries,locations,states-ansi,timezones,helpers}.ts` or any `src/data/*.ts` — no regression > 5% on any bucket at fixed feature set.
- Scoped package — `publishConfig.access = "public"` is mandatory, do not remove.
- `scripts/` is the only place that uses `country-locale-map`; `tests/` is the only place that uses `joi`. Both stay in `devDependencies`.
- **Publish** — one-off npm token bootstrap for the first `1.0.0` publish (npm has no pre-publish Trusted Publisher form for not-yet-existing scoped packages), then OIDC Trusted Publisher + `npm provenance` from `1.0.1+`. Never re-add the token once OIDC is configured. `pnpm publish` from a developer machine is forbidden — publish is CI-owned.
- **Git** — `main`-only; branch → PR → squash-merge → tag the merge commit. The tag is the only manual step; release automation (version bump, `CHANGELOG.md`, npm publish, GitHub release) is owned by [`coroboros/ci`](https://github.com/coroboros/ci). Never hand-edit `package.json` version or `CHANGELOG.md`. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` before tagging.
