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
- [Compared to alternatives](#compared-to-alternatives)
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

Country, capital, city, ANSI state, and timezone data normally ships in separate npm packages with mismatched cross-references. `@coroboros/location-timezone` consolidates them into one zipson-compressed payload: UN country names, CIA Factbook official forms, ISO 3166-1 codes, ANSI FIPS state codes, IANA timezones, and ~40,000 cities with coordinates. Lookups resolve in O(1) via `Map` and `Set` indexes built once at module load. See [`bench/baseline.md`](bench/baseline.md) for the head-to-head numbers vs the pre-optim linear-scan baseline.

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

<br>

A country's capital city.

| Property | Type | Description |
| --- | --- | --- |
| `name` | `string` | UTF-8 name. Empty string when the country has no capital. |
| `nameAscii` | `string` | ASCII transliteration. |
| `latitude` | `number` | Decimal degrees. |
| `longitude` | `number` | Decimal degrees. |
| `province` | `string` | |
| `state` | `string` | USPS code (US only). Empty string otherwise. |
| `timezone` | `string` | IANA timezone. |
| `country?` | [`Country`](#types) | Back-reference. Always present at runtime on capitals returned by the API. |

</details>

<details>
<summary><code>Coordinates</code></summary>

<br>

Bounding-box bounds for [`findLocationsByCoordinates`](#locations). Pass at least one latitude bound and one longitude bound; missing bounds default to `±Infinity`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `latitudeFrom?` | `number` | `Number.NEGATIVE_INFINITY` | Southern latitude bound. |
| `latitudeTo?` | `number` | `Number.POSITIVE_INFINITY` | Northern latitude bound. |
| `longitudeFrom?` | `number` | `Number.NEGATIVE_INFINITY` | Western longitude bound. |
| `longitudeTo?` | `number` | `Number.POSITIVE_INFINITY` | Eastern longitude bound. |

</details>

<details>
<summary><code>Country</code></summary>

<br>

A country with ISO codes and IANA timezones.

| Property | Type | Description |
| --- | --- | --- |
| `name` | `string` | UN short form. |
| `officialName` | `string` | UN long form. |
| `iso2` | `string` | ISO 3166-1 alpha-2. |
| `iso3` | `string` | ISO 3166-1 alpha-3. |
| `timezones` | `ReadonlyArray<string>` | IANA timezones, sorted ascending. |
| `capital?` | [`Capital`](#types) | Back-reference. Always present at runtime on countries returned by the API. |

</details>

<details>
<summary><code>Location</code></summary>

<br>

A city with coordinates and its country.

| Property | Type | Description |
| --- | --- | --- |
| `city` | `string` | UTF-8 name. |
| `cityAscii` | `string` | ASCII transliteration. |
| `country` | [`Country`](#types) | The country it belongs to. |
| `latitude` | `number` | Decimal degrees. |
| `longitude` | `number` | Decimal degrees. |
| `province` | `string` | |
| `state` | `string` | USPS code (US only). Empty string otherwise. |
| `timezone` | `string` | IANA timezone. |

</details>

<details>
<summary><code>StateAnsi</code></summary>

<br>

A US state with ANSI identifiers.

| Property | Type | Description |
| --- | --- | --- |
| `fipsCode` | `string` | FIPS state code (2 digits). |
| `gnisid` | `string` | Geographic Names Information System Identifier (8 digits). |
| `name` | `string` | State name. |
| `uspsCode` | `string` | USPS two-letter code. |

</details>

### Capitals and countries

<details>
<summary><code>findCapitalOfCountryIso(code)</code></summary>

<br>

Find the capital of a country by its ISO 3166-1 alpha-2 or alpha-3 code. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | *(required)* | Country ISO code (alpha-2 or alpha-3). |

**Returns** — [`Capital`](#types) `| undefined`. The matching capital, or `undefined` when `code` does not resolve.

**Examples**

```ts
findCapitalOfCountryIso('JP');   // → { name: 'Tokyo', ... }
findCapitalOfCountryIso('jpn');  // → { name: 'Tokyo', ... }
findCapitalOfCountryIso('XX');   // → undefined
```

</details>

<details>
<summary><code>findCapitalOfCountryName(name)</code></summary>

<br>

Find the capital of a country by short or official name. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | Country name (UN short form or official form). |

**Returns** — [`Capital`](#types) `| undefined`. The matching capital, or `undefined` when `name` does not resolve.

**Examples**

```ts
findCapitalOfCountryName('Japan');                            // → { name: 'Tokyo', ... }
findCapitalOfCountryName('British Indian Ocean Territory');   // → { name: 'Diego Garcia', ... }
findCapitalOfCountryName('The British Indian Ocean Territory'); // same — official form
```

</details>

<details>
<summary><code>findCountryByCapitalName(name)</code></summary>

<br>

Find a country by its capital name (UTF-8 or ASCII). Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | Capital name (`Capital.name` or `Capital.nameAscii`). |

**Returns** — [`Country`](#types) `| undefined`. The matching country, or `undefined` when `name` does not resolve.

**Examples**

```ts
findCountryByCapitalName('Tokyo');         // → { name: 'Japan', ... }
findCountryByCapitalName('Diego Garcia');  // → { name: 'British Indian Ocean Territory', ... }
findCountryByCapitalName('');              // → undefined
```

</details>

<details>
<summary><code>findCountryByIso(code)</code></summary>

<br>

Find a country by ISO 3166-1 alpha-2 or alpha-3 code. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | *(required)* | Country ISO code (alpha-2 or alpha-3). |

**Returns** — [`Country`](#types) `| undefined`. The matching country, or `undefined` when `code` does not resolve.

**Examples**

```ts
findCountryByIso('BF');   // → { name: 'Burkina Faso', iso2: 'BF', iso3: 'BFA', ... }
findCountryByIso('BFA');  // → { name: 'Burkina Faso', ... }
findCountryByIso('cL');   // → { name: 'Chile', ... } — case-insensitive
```

</details>

<details>
<summary><code>findCountryByName(name)</code></summary>

<br>

Find a country by short or official name. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | Country name (`Country.name` or `Country.officialName`). |

**Returns** — [`Country`](#types) `| undefined`. The matching country, or `undefined` when `name` does not resolve.

**Examples**

```ts
findCountryByName('Costa Rica');                              // → { name: 'Costa Rica', ... }
findCountryByName('The Republic of Costa Rica');              // same — official form
findCountryByName('The Territory of Cocos (Keeling) Islands'); // → official form match
```

</details>

<details>
<summary><code>getCapitals()</code></summary>

<br>

All country capitals, sorted by country name ascending.

**Returns** — `ReadonlyArray<`[`Capital`](#types)`>`. Frozen — do not mutate.

**Examples**

```ts
const capitals = getCapitals();
capitals.length;                  // → number of countries
capitals.find(c => c.name === 'Tokyo')?.country?.iso2;  // → 'JP'
```

</details>

<details>
<summary><code>getCountries()</code></summary>

<br>

All countries, sorted by country name ascending.

**Returns** — `ReadonlyArray<`[`Country`](#types)`>`. Frozen — do not mutate.

**Examples**

```ts
const countries = getCountries();
countries.length;                                                   // → ~250
countries.filter(c => c.timezones.length > 1).length;               // multi-timezone countries
countries.find(c => c.iso2 === 'US')?.officialName;                 // → 'The United States of America'
```

</details>

<details>
<summary><code>getCountryIso2CodeByIso3(iso3)</code></summary>

<br>

Get the ISO 3166-1 alpha-2 code paired with an alpha-3 code. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `iso3` | `string` | *(required)* | Alpha-3 code. |

**Returns** — `string | undefined`. The paired alpha-2 code, or `undefined` when `iso3` is unknown.

**Examples**

```ts
getCountryIso2CodeByIso3('THA');  // → 'TH'
getCountryIso2CodeByIso3('USA');  // → 'US'
getCountryIso2CodeByIso3('XXX');  // → undefined
```

</details>

<details>
<summary><code>getCountryIso2Codes()</code></summary>

<br>

All ISO 3166-1 alpha-2 codes, sorted ascending.

**Returns** — `ReadonlyArray<string>`. Frozen — do not mutate.

**Examples**

```ts
const codes = getCountryIso2Codes();
codes.length;        // → ~250
codes.includes('JP'); // → true
codes[0];            // → 'AD'
```

</details>

<details>
<summary><code>getCountryIso3CodeByIso2(iso2)</code></summary>

<br>

Get the ISO 3166-1 alpha-3 code paired with an alpha-2 code. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `iso2` | `string` | *(required)* | Alpha-2 code. |

**Returns** — `string | undefined`. The paired alpha-3 code, or `undefined` when `iso2` is unknown.

**Examples**

```ts
getCountryIso3CodeByIso2('TH');  // → 'THA'
getCountryIso3CodeByIso2('US');  // → 'USA'
getCountryIso3CodeByIso2('XX');  // → undefined
```

</details>

<details>
<summary><code>getCountryIso3Codes()</code></summary>

<br>

All ISO 3166-1 alpha-3 codes, sorted ascending.

**Returns** — `ReadonlyArray<string>`. Frozen — do not mutate.

**Examples**

```ts
const codes = getCountryIso3Codes();
codes.length;         // → ~250
codes.includes('JPN'); // → true
codes[0];             // → 'AFG'
```

</details>

<details>
<summary><code>isValidCountryIso(code)</code></summary>

<br>

Validate an ISO 3166-1 alpha-2 or alpha-3 code. **Case-sensitive** — codes must be uppercase. The `find*` helpers on this page accept any case.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | *(required)* | ISO code, uppercase. |

**Returns** — `{ valid: boolean; iso2: boolean; iso3: boolean }`. `valid` is `true` when `code` resolves; `iso2` / `iso3` discriminates the form.

**Examples**

```ts
isValidCountryIso('JP');  // → { valid: true,  iso2: true,  iso3: false }
isValidCountryIso('JPN'); // → { valid: true,  iso2: false, iso3: true  }
isValidCountryIso('jp');  // → { valid: false, iso2: false, iso3: false } — lowercase rejected
isValidCountryIso('XX');  // → { valid: false, iso2: false, iso3: false }
```

</details>

### Locations

<details>
<summary><code>findLocationsByCoordinates(coordinates)</code></summary>

<br>

Find locations within a bounding box. At least one latitude bound and one longitude bound must be set; missing bounds default to `±Infinity`.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `coordinates` | [`Coordinates`](#types) | *(required)* | Bounding-box bounds. See the type for each field. |

**Returns** — `ReadonlyArray<`[`Location`](#types)`>`. Locations within the box, or `[]` when neither latitude bound or neither longitude bound is set.

**Examples**

```ts
findLocationsByCoordinates({ latitudeFrom: 0, longitudeFrom: 0 });
// → Location[] — north-east of the equator and the prime meridian

findLocationsByCoordinates({ latitudeFrom: -55, latitudeTo: 1, longitudeFrom: -8, longitudeTo: 5 });
// → Location[] inside the box

findLocationsByCoordinates({});                             // → []
```

</details>

<details>
<summary><code>findLocationsByCountryIso(code)</code></summary>

<br>

Find locations by country ISO 3166-1 alpha-2 or alpha-3 code. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | *(required)* | Country ISO code (alpha-2 or alpha-3). |

**Returns** — `ReadonlyArray<`[`Location`](#types)`>`. Locations in the country, or `[]` when `code` does not resolve.

**Examples**

```ts
findLocationsByCountryIso('JP');   // → Location[] — Japanese cities
findLocationsByCountryIso('JPN');  // same — alpha-3 works
findLocationsByCountryIso('XX');   // → []
```

</details>

<details>
<summary><code>findLocationsByCountryName(name, partialMatch?)</code></summary>

<br>

Find locations by country short or official name. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | Country name (`Country.name` or `Country.officialName`). |
| `partialMatch?` | `boolean` | `false` | When `true`, matches names that contain `name` as a substring. |

**Returns** — `ReadonlyArray<`[`Location`](#types)`>`. Matching locations, or `[]` when nothing matches.

**Examples**

```ts
findLocationsByCountryName('Timor-Leste');                          // → Location[]
findLocationsByCountryName('The Democratic Republic of Timor-Leste'); // same — official form
findLocationsByCountryName('timor', true);                          // → Location[] — partial match
findLocationsByCountryName('timor', false);                         // → []
```

</details>

<details>
<summary><code>findLocationsByProvince(name, partialMatch?)</code></summary>

<br>

Find locations by province. Case-insensitive. Province data is not exhaustively verified — see [Limitations](#limitations).

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | Province name. Pass `''` to find locations with no province. |
| `partialMatch?` | `boolean` | `false` | When `true`, matches provinces that contain `name` as a substring. |

**Returns** — `ReadonlyArray<`[`Location`](#types)`>`. Matching locations, or `[]` when nothing matches.

**Examples**

```ts
findLocationsByProvince('Tristan da Cunha');     // → Location[]
findLocationsByProvince('Damascus');             // → Location[]
findLocationsByProvince('tokel', true);          // → Location[] — partial: 'Tokelau'
```

</details>

<details>
<summary><code>findLocationsByState(name, partialMatch?)</code></summary>

<br>

Find locations by USPS state name or code (US only). Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | USPS code or state field. Pass `''` to find non-US locations. |
| `partialMatch?` | `boolean` | `false` | When `true`, matches state fields that contain `name` as a substring. |

**Returns** — `ReadonlyArray<`[`Location`](#types)`>`. Matching locations, or `[]` when nothing matches.

**Examples**

```ts
findLocationsByState('NY');         // → Location[] — New York
findLocationsByState('ny');         // same — case-insensitive
findLocationsByState('x', true);    // → Location[] — partial: 'TX'
```

</details>

<details>
<summary><code>getLocations()</code></summary>

<br>

All locations, sorted by city name ascending.

**Returns** — `ReadonlyArray<`[`Location`](#types)`>`. Frozen — do not mutate.

**Examples**

```ts
const locations = getLocations();
locations.length;                                       // → ~40,000
locations.filter(l => l.country.iso2 === 'JP').length;  // Japanese cities
```

</details>

### States ANSI

<details>
<summary><code>findStateAnsiByFipsCode(code)</code></summary>

<br>

Find a US state by its FIPS State Code ANSI.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | *(required)* | FIPS code (length 2). |

**Returns** — [`StateAnsi`](#types) `| undefined`. The matching state, or `undefined` when `code` is not a known FIPS code.

**Examples**

```ts
findStateAnsiByFipsCode('05');   // → { name: 'Arkansas', uspsCode: 'AR', gnisid: '00068085', ... }
findStateAnsiByFipsCode('99');   // → undefined
findStateAnsiByFipsCode('');     // → undefined — length 2 required
```

</details>

<details>
<summary><code>findStateAnsiByGnisid(id)</code></summary>

<br>

Find a US state by its GNISID (Geographic Names Information System Identifier).

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | *(required)* | GNISID (8 digits). |

**Returns** — [`StateAnsi`](#types) `| undefined`. The matching state, or `undefined` when `id` is unknown.

**Examples**

```ts
findStateAnsiByGnisid('00068085');  // → { name: 'Arkansas', ... }
findStateAnsiByGnisid('99999999');  // → undefined
```

</details>

<details>
<summary><code>findStateAnsiByName(name)</code></summary>

<br>

Find a US state by name. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | State name. |

**Returns** — [`StateAnsi`](#types) `| undefined`. The matching state, or `undefined` when `name` does not resolve.

**Examples**

```ts
findStateAnsiByName('Arkansas');  // → { uspsCode: 'AR', fipsCode: '05', ... }
findStateAnsiByName('arkansas');  // same — case-insensitive
findStateAnsiByName('Atlantis');  // → undefined
```

</details>

<details>
<summary><code>findStateAnsiByUspsCode(code)</code></summary>

<br>

Find a US state by USPS code. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | *(required)* | USPS two-letter code. |

**Returns** — [`StateAnsi`](#types) `| undefined`. The matching state, or `undefined` when `code` is not a known USPS code.

**Examples**

```ts
findStateAnsiByUspsCode('AR');   // → { name: 'Arkansas', fipsCode: '05', ... }
findStateAnsiByUspsCode('ar');   // same — case-insensitive
findStateAnsiByUspsCode('ZZ');   // → undefined
```

</details>

<details>
<summary><code>getStatesAnsi()</code></summary>

<br>

All US states (ANSI), sorted by name ascending.

**Returns** — `ReadonlyArray<`[`StateAnsi`](#types)`>`. Frozen — do not mutate.

**Examples**

```ts
const states = getStatesAnsi();
states.length;                                  // → 56 (50 states + DC + territories)
states.find(s => s.uspsCode === 'CA')?.name;    // → 'California'
```

</details>

### Timezones

<details>
<summary><code>findTimezoneByCapitalOfCountryIso(code)</code></summary>

<br>

IANA timezone for a country's capital, by ISO 3166-1 alpha-2 or alpha-3 code. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | *(required)* | Country ISO code (alpha-2 or alpha-3). |

**Returns** — `string | undefined`. The IANA timezone of the country's capital, or `undefined` when `code` does not resolve.

**Examples**

```ts
findTimezoneByCapitalOfCountryIso('JP');   // → 'Asia/Tokyo'
findTimezoneByCapitalOfCountryIso('FRA');  // → 'Europe/Paris'
findTimezoneByCapitalOfCountryIso('XX');   // → undefined
```

</details>

<details>
<summary><code>findTimezoneByCapitalOfCountryName(name)</code></summary>

<br>

IANA timezone for a country's capital, by country short or official name. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | Country name (`Country.name` or `Country.officialName`). |

**Returns** — `string | undefined`. The IANA timezone of the country's capital, or `undefined` when `name` does not resolve.

**Examples**

```ts
findTimezoneByCapitalOfCountryName('Japan');                    // → 'Asia/Tokyo'
findTimezoneByCapitalOfCountryName('The French Republic');      // → 'Europe/Paris'
findTimezoneByCapitalOfCountryName('Atlantis');                 // → undefined
```

</details>

<details>
<summary><code>findTimezoneByCityName(name)</code></summary>

<br>

IANA timezone for a city, by name (UTF-8 or ASCII). Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | City name. |

**Returns** — `string | undefined`. The IANA timezone of the matching city, or `undefined` when `name` is empty or does not resolve.

**Examples**

```ts
findTimezoneByCityName('Tokyo');     // → 'Asia/Tokyo'
findTimezoneByCityName('Göteborg');  // → 'Europe/Stockholm'
findTimezoneByCityName('Goteborg');  // same — ASCII transliteration works too
findTimezoneByCityName('');          // → undefined
```

</details>

<details>
<summary><code>findTimezonesByCountryIso(code)</code></summary>

<br>

All IANA timezones for a country, by ISO 3166-1 alpha-2 or alpha-3 code. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | *(required)* | Country ISO code (alpha-2 or alpha-3). |

**Returns** — `ReadonlyArray<string>`. The country's timezones, or `[]` when `code` does not resolve. Frozen — do not mutate.

**Examples**

```ts
findTimezonesByCountryIso('US');   // → ['America/Adak', 'America/Anchorage', ...]
findTimezonesByCountryIso('JPN');  // → ['Asia/Tokyo']
findTimezonesByCountryIso('XX');   // → []
```

</details>

<details>
<summary><code>findTimezonesByCountryName(name)</code></summary>

<br>

All IANA timezones for a country, by short or official name. Case-insensitive.

**Parameters**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | *(required)* | Country name (`Country.name` or `Country.officialName`). |

**Returns** — `ReadonlyArray<string>`. The country's timezones, or `[]` when `name` does not resolve. Frozen — do not mutate.

**Examples**

```ts
findTimezonesByCountryName('United States of America');         // → ['America/Adak', ...]
findTimezonesByCountryName('The United States of America');     // same — official form
findTimezonesByCountryName('Atlantis');                          // → []
```

</details>

<details>
<summary><code>getTimezones()</code></summary>

<br>

All IANA timezones (the subset returned by `Intl.supportedValuesOf('timeZone')` at data-build time), sorted ascending.

**Returns** — `ReadonlyArray<string>`. Frozen — do not mutate.

**Examples**

```ts
const timezones = getTimezones();
timezones.length;                       // → ~430
timezones.includes('Asia/Tokyo');       // → true
timezones[0];                           // → 'Africa/Abidjan'
```

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

## Compared to alternatives

| Feature                                              | `i18n-iso-countries` | `countries-list` |     `geo-tz`      |  `city-timezones`   | **`@coroboros/location-timezone`** |
| ---------------------------------------------------- | :------------------: | :--------------: | :---------------: | :-----------------: | :--------------------------------: |
| Country names with UN + CIA official forms           | no                   | no               | no                | no                  | yes                                |
| ISO 3166-1 alpha-2 / alpha-3 codes                   | yes                  | yes              | no                | yes                 | yes                                |
| Capital data with coordinates + IANA timezone        | no                   | no (name only)   | no                | no                  | yes                                |
| US state codes — ANSI FIPS + USPS                    | no                   | no               | no                | USPS only           | yes                                |
| City data with coordinates                           | no                   | no               | no                | ~7,300              | ~40,000                            |
| Timezone lookup by city name                         | no                   | no               | no (lat/lng only) | yes (O(n) scan)     | yes (O(1) Map)                     |
| Cross-references resolved across domains             | no                   | no               | n/a               | no                  | yes                                |
| Runtime dependencies                                 | 1                    | 0                | 4                 | 0                   | 1 (`zipson`)                       |

The gap is single-package consolidation across all five domains. Country-only packages (`i18n-iso-countries`, `countries-list`) cover ISO codes and names, nothing else. `geo-tz` and `tz-lookup` solve a different input model: lat/lng polygon → timezone, useful when you only know coordinates. `city-timezones` is the closest peer in shape, resolving country and timezone from a city name. It carries ~7,300 cities with no capitals or state-FIPS codes, and runs every lookup through `Array.filter`. `@coroboros/location-timezone` carries all five domains: countries, capitals, ~40,000 cities, US states ANSI, IANA timezones. The library builds Map and Set indexes once at module load. Cross-references resolve at parse time, so `findCapitalOfCountryIso('JP').country` returns the same object as `findCountryByIso('JP')`.

## Contributing

Bug reports and PRs welcome.

- Open an issue before submitting non-trivial PRs.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
- Run `pnpm lint && pnpm typecheck && pnpm test` before pushing.
- Target the `main` branch.

## License

[MIT](LICENSE.md)
