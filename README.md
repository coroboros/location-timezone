<div align="center">

<img src="assets/logo.png" width="288" height="288" alt="@coroboros/location-timezone"/>

<!-- omit in toc -->
# @coroboros/location-timezone

**Capital, country, city, ANSI state, and IANA timezone lookups for Node.js.**

Curated UN country names, CIA Factbook official forms, ISO 3166-1 codes, ANSI FIPS state codes, IANA timezones, and ~40,000 city coordinates. One zipson-compressed package. O(1) lookups.

[![npm](https://img.shields.io/npm/v/@coroboros/location-timezone?style=flat-square&color=000000)](https://www.npmjs.com/package/@coroboros/location-timezone)
[![ci](https://img.shields.io/github/actions/workflow/status/coroboros/location-timezone/ci.yml?branch=main&style=flat-square&label=ci&color=000000)](https://github.com/coroboros/location-timezone/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-000000?style=flat-square)](https://opensource.org/licenses/MIT)
[![stars](https://img.shields.io/github/stars/coroboros/location-timezone?style=flat-square&label=stars&color=000000)](https://github.com/coroboros/location-timezone)
[![coroboros.com](https://img.shields.io/badge/coroboros.com-000000?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMiAxMmgyME0xMiAyYTE1LjMgMTUuMyAwIDAgMSA0IDEwIDE1LjMgMTUuMyAwIDAgMS00IDEwIDE1LjMgMTUuMyAwIDAgMS00LTEwIDE1LjMgMTUuMyAwIDAgMSA0LTEweiIvPjwvc3ZnPg==)](https://coroboros.com)

</div>

<!-- omit in toc -->
## Contents

- [Requirements](#requirements)
- [Install](#install)
- [Usage](#usage)
- [Why this exists](#why-this-exists)
- [Data](#data)
- [API](#api)
- [Subpath exports](#subpath-exports)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- Node.js `>= 22 LTS`. Use [fnm](https://github.com/Schniz/fnm) for fast Rust-based version switching.
- Any modern package manager: pnpm, npm, yarn, bun.

## Install

```bash
pnpm add @coroboros/location-timezone
```

```bash
npm install @coroboros/location-timezone
```

```bash
yarn add @coroboros/location-timezone
```

```bash
bun add @coroboros/location-timezone
```

## Usage

```ts
// ESM (recommended) — named imports
import {
  findCapitalOfCountryIso,
  findTimezoneByCityName,
  getCountries,
} from '@coroboros/location-timezone';

findCapitalOfCountryIso('JP');         // → { name: 'Tokyo', ... }
findTimezoneByCityName('Göteborg');    // → 'Europe/Stockholm'
getCountries();                        // → Country[]
```

```ts
// ESM — default merged object
import locationTimezone from '@coroboros/location-timezone';

locationTimezone.findCountryByIso('USA');
```

```js
// CommonJS
const locationTimezone = require('@coroboros/location-timezone').default;

locationTimezone.findStateAnsiByUspsCode('NY');
```

## Why this exists

Country, capital, city, ANSI state, and timezone data normally ships in separate npm packages with mismatched cross-references. `@coroboros/location-timezone` consolidates them into one zipson-compressed payload: UN country names, CIA Factbook official forms, ISO 3166-1 codes, ANSI FIPS state codes, IANA timezones, and ~40,000 cities with coordinates. Lookups resolve in O(1) via `Map` and `Set` indexes built once at module load.

## Data

- Country names and ISO 3166-1 alpha-2 / alpha-3 codes from [the UN country list](https://unterm.un.org/unterm2/en/country) and [the CIA World Factbook](https://www.cia.gov/the-world-factbook/).
- ANSI USA state codes — FIPS state code, GNISID, official USPS code.
- IANA timezones from `Intl.supportedValuesOf('timeZone')` (run by the latest Node.js LTS).
- City coordinates in decimal degrees.
- Three non-ISO entries assigned internal codes: `Northern Cyprus` (`XC`/`CYN`), `Kosovo` (`XK`/`KOS`), `Somaliland` (`XS`/`SOL`).
- Absent fields hold `''`. No `null`. No `undefined`.
- Payloads are compressed with [`zipson`](https://github.com/jgranstrom/zipson) and parsed once at module load.

## API

### Types

<details>
<summary><code>Capital</code></summary>

| Property | Type | Notes |
|---|---|---|
| `name` | `string` | UTF-8 name. |
| `nameAscii` | `string` | ASCII transliteration. |
| `latitude` | `number` | Decimal degrees. |
| `longitude` | `number` | Decimal degrees. |
| `province` | `string` | |
| `state` | `string` | USPS code (US only). Empty string otherwise. |
| `timezone` | `string` | IANA timezone. |
| `country?` | `Country` | Optional back-reference. |

</details>

<details>
<summary><code>Country</code></summary>

| Property | Type | Notes |
|---|---|---|
| `name` | `string` | UN short form. |
| `officialName` | `string` | UN long form. |
| `iso2` | `string` | ISO 3166-1 alpha-2. |
| `iso3` | `string` | ISO 3166-1 alpha-3. |
| `timezones` | `string[]` | IANA timezones. |
| `capital?` | `Capital` | Optional back-reference. |

</details>

<details>
<summary><code>Location</code></summary>

| Property | Type | Notes |
|---|---|---|
| `city` | `string` | UTF-8 name. |
| `cityAscii` | `string` | ASCII transliteration. |
| `country` | `Country` | |
| `latitude` | `number` | Decimal degrees. |
| `longitude` | `number` | Decimal degrees. |
| `province` | `string` | |
| `state` | `string` | USPS code (US only). |
| `timezone` | `string` | IANA timezone. |

</details>

<details>
<summary><code>StateAnsi</code></summary>

| Property | Type | Notes |
|---|---|---|
| `fipsCode` | `string` | FIPS state code. |
| `gnisid` | `string` | Geographic Names Information System Identifier. |
| `name` | `string` | |
| `uspsCode` | `string` | USPS two-letter code. |

</details>

### Capitals and countries

<details>
<summary><code>findCapitalOfCountryIso(code: string): Capital | undefined</code></summary>

Find the capital of a country by ISO 3166-1 alpha-2 or alpha-3 code.

| Parameter | Type | Notes |
|---|---|---|
| `code` | `string` | Country ISO code, case-insensitive. |

</details>

<details>
<summary><code>findCapitalOfCountryName(name: string): Capital | undefined</code></summary>

Find the capital of a country by short or official name.

| Parameter | Type | Notes |
|---|---|---|
| `name` | `string` | Country name, case-insensitive. |

</details>

<details>
<summary><code>findCountryByCapitalName(name: string): Country | undefined</code></summary>

Find a country by its capital name.

| Parameter | Type | Notes |
|---|---|---|
| `name` | `string` | Capital name, UTF-8 or ASCII, case-insensitive. |

</details>

<details>
<summary><code>findCountryByIso(code: string): Country | undefined</code></summary>

Find a country by ISO 3166-1 alpha-2 or alpha-3 code.

| Parameter | Type | Notes |
|---|---|---|
| `code` | `string` | Country ISO code, case-insensitive. |

</details>

<details>
<summary><code>findCountryByName(name: string): Country | undefined</code></summary>

Find a country by short or official name.

| Parameter | Type | Notes |
|---|---|---|
| `name` | `string` | Country name, case-insensitive. |

</details>

<details>
<summary><code>getCapitals(): Capital[]</code></summary>

All country capitals, sorted by country name ascending.

</details>

<details>
<summary><code>getCountries(): Country[]</code></summary>

All countries, sorted by country name ascending.

</details>

<details>
<summary><code>getCountryIso2CodeByIso3(iso3: string): string | undefined</code></summary>

Map ISO 3166-1 alpha-3 to alpha-2.

| Parameter | Type | Notes |
|---|---|---|
| `iso3` | `string` | Alpha-3 code, case-insensitive. |

</details>

<details>
<summary><code>getCountryIso2Codes(): string[]</code></summary>

All ISO 3166-1 alpha-2 codes, sorted ascending.

</details>

<details>
<summary><code>getCountryIso3CodeByIso2(iso2: string): string | undefined</code></summary>

Map ISO 3166-1 alpha-2 to alpha-3.

| Parameter | Type | Notes |
|---|---|---|
| `iso2` | `string` | Alpha-2 code, case-insensitive. |

</details>

<details>
<summary><code>getCountryIso3Codes(): string[]</code></summary>

All ISO 3166-1 alpha-3 codes, sorted ascending.

</details>

<details>
<summary><code>isValidCountryIso(code: string): { valid: boolean; iso2: boolean; iso3: boolean }</code></summary>

Validate an ISO 3166-1 alpha-2 or alpha-3 code. **Case-sensitive** — codes must be uppercase.

| Parameter | Type | Notes |
|---|---|---|
| `code` | `string` | ISO code, case-sensitive. |

</details>

### Locations

<details>
<summary><code>findLocationsByCoordinates(coordinates: { latitudeFrom?, latitudeTo?, longitudeFrom?, longitudeTo? }): Location[]</code></summary>

Find locations within a bounding box. At least one latitude bound and one longitude bound must be set; missing bounds default to `±Infinity`.

| Parameter | Type | Default |
|---|---|---|
| `latitudeFrom?` | `number` | `Number.NEGATIVE_INFINITY` |
| `latitudeTo?` | `number` | `Number.POSITIVE_INFINITY` |
| `longitudeFrom?` | `number` | `Number.NEGATIVE_INFINITY` |
| `longitudeTo?` | `number` | `Number.POSITIVE_INFINITY` |

</details>

<details>
<summary><code>findLocationsByCountryIso(code: string): Location[]</code></summary>

Find locations by ISO 3166-1 alpha-2 or alpha-3 code.

| Parameter | Type | Notes |
|---|---|---|
| `code` | `string` | Country ISO code, case-insensitive. |

</details>

<details>
<summary><code>findLocationsByCountryName(name: string, partialMatch?: boolean): Location[]</code></summary>

Find locations by country name.

| Parameter | Type | Default |
|---|---|---|
| `name` | `string` | — |
| `partialMatch?` | `boolean` | `false` |

</details>

<details>
<summary><code>findLocationsByProvince(name: string, partialMatch?: boolean): Location[]</code></summary>

Find locations by province. Province data is not exhaustively verified — see [Limitations](#limitations).

| Parameter | Type | Default |
|---|---|---|
| `name` | `string` | — |
| `partialMatch?` | `boolean` | `false` |

</details>

<details>
<summary><code>findLocationsByState(name: string, partialMatch?: boolean): Location[]</code></summary>

Find locations by USPS state name or code (US only).

| Parameter | Type | Default |
|---|---|---|
| `name` | `string` | — |
| `partialMatch?` | `boolean` | `false` |

</details>

<details>
<summary><code>getLocations(): Location[]</code></summary>

All locations, sorted by city name ascending.

</details>

### States ANSI

<details>
<summary><code>findStateAnsiByFipsCode(code: string): StateAnsi | undefined</code></summary>

Find a US state by FIPS code (2 characters).

| Parameter | Type | Notes |
|---|---|---|
| `code` | `string` | FIPS code, case-insensitive, length 2. |

</details>

<details>
<summary><code>findStateAnsiByGnisid(id: string): StateAnsi | undefined</code></summary>

Find a US state by GNISID.

| Parameter | Type | Notes |
|---|---|---|
| `id` | `string` | GNISID, case-insensitive. |

</details>

<details>
<summary><code>findStateAnsiByName(name: string): StateAnsi | undefined</code></summary>

Find a US state by name.

| Parameter | Type | Notes |
|---|---|---|
| `name` | `string` | State name, case-insensitive. |

</details>

<details>
<summary><code>findStateAnsiByUspsCode(code: string): StateAnsi | undefined</code></summary>

Find a US state by USPS code (2 characters).

| Parameter | Type | Notes |
|---|---|---|
| `code` | `string` | USPS code, case-insensitive, length 2. |

</details>

<details>
<summary><code>getStatesAnsi(): StateAnsi[]</code></summary>

All US states (ANSI), sorted by name ascending.

</details>

### Timezones

<details>
<summary><code>findTimezoneByCapitalOfCountryIso(code: string): string | undefined</code></summary>

IANA timezone for a country's capital, by ISO 3166-1 alpha-2 or alpha-3 code.

| Parameter | Type | Notes |
|---|---|---|
| `code` | `string` | Country ISO code, case-insensitive. |

</details>

<details>
<summary><code>findTimezoneByCapitalOfCountryName(name: string): string | undefined</code></summary>

IANA timezone for a country's capital, by country name.

| Parameter | Type | Notes |
|---|---|---|
| `name` | `string` | Country name, case-insensitive. |

</details>

<details>
<summary><code>findTimezoneByCityName(name: string): string | undefined</code></summary>

IANA timezone for a city, by name (UTF-8 or ASCII).

| Parameter | Type | Notes |
|---|---|---|
| `name` | `string` | City name, case-insensitive. |

</details>

<details>
<summary><code>findTimezonesByCountryIso(code: string): string[]</code></summary>

All IANA timezones for a country, by ISO 3166-1 alpha-2 or alpha-3 code.

| Parameter | Type | Notes |
|---|---|---|
| `code` | `string` | Country ISO code, case-insensitive. |

</details>

<details>
<summary><code>findTimezonesByCountryName(name: string): string[]</code></summary>

All IANA timezones for a country, by name.

| Parameter | Type | Notes |
|---|---|---|
| `name` | `string` | Country name, case-insensitive. |

</details>

<details>
<summary><code>getTimezones(): string[]</code></summary>

All IANA timezones (the subset returned by `Intl.supportedValuesOf('timeZone')` at data-build time), sorted ascending.

</details>

## Subpath exports

The main entry `@coroboros/location-timezone` bundles every domain. For finer-grained tree-shaking, import only the domain you need:

```ts
import { findStateAnsiByUspsCode } from '@coroboros/location-timezone/states-ansi';  // ~5 kB
import { findCountryByIso } from '@coroboros/location-timezone/countries';            // ~85 kB
import { findTimezoneByCityName } from '@coroboros/location-timezone/timezones';      // ~870 kB
import { findLocationsByCountryIso } from '@coroboros/location-timezone/locations';   // ~860 kB
```

Sizes include the chunked dependencies each subpath transitively pulls. The merged default object is only exposed on the main entry; subpaths expose named exports only.

## Limitations

- **Province data is unreliable** — `findLocationsByProvince` works on the field as-is but coverage and naming vary by country. Treat as best-effort.
- **`isValidCountryIso` is case-sensitive** — pass uppercase. The `find*` helpers accept any case.
- **Non-ISO codes** — Northern Cyprus (`XC`/`CYN`), Kosovo (`XK`/`KOS`), and Somaliland (`XS`/`SOL`) use synthesized codes outside ISO 3166-1.
- **Timezone set is snapshot** — IANA timezones are captured once when the data is rebuilt; the runtime does not re-query `Intl`. Rebuild and republish on tz-database changes.
- **No reverse geocoding** — `findLocationsByCoordinates` filters a bounding box; it does not return the nearest city.

## Contributing

Bug reports and PRs welcome.

- Open an issue before submitting non-trivial PRs.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
- Run `pnpm lint && pnpm typecheck && pnpm test` before pushing.
- Target the `main` branch.

## License

[MIT](LICENSE.md)
