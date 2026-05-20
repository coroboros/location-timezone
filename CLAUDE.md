# @coroboros/location-timezone

Lookup helpers for capitals, countries, cities, ANSI states (USA), and IANA timezones. Data is compressed JSON parsed once at module load.

## Canonical rules

Follows the Coroboros engineering global rules. Repo-specific divergences are stated inline in `## Rules` below.

> **Public-repo hygiene:** this is shipped into a public community repo. Never reference private `~/.claude/rules/*` paths, local machine paths, or the migration recipe here — keep it generic.

## Tech Stack
- TypeScript strict, ES modules + CJS dual build (tsdown)
- Vitest for tests, Biome for lint/format
- Node.js 22 LTS
- One runtime dependency: `zipson` (data decompression)

## Commands
- `pnpm build` — bundle ESM + CJS + types to `dist/`
- `pnpm test` — run the Vitest suite
- `pnpm lint` / `pnpm lint:fix` — Biome check
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm dev` — `tsdown --watch`

## Important Files
- `src/index.ts` — public entry; named exports + default merged object
- `src/countries.ts`, `src/locations.ts`, `src/states-ansi.ts`, `src/timezones.ts` — per-domain query helpers
- `src/helpers.ts` — internal `exists`, `is`, `hasLen`, `match`, `isValidCountryIso`
- `src/interfaces.ts` — `Capital`, `Country`, `Location`, `StateAnsi`
- `src/data/index.ts` — loads and parses zipson-compressed JSON
- `src/data/*.json` — compressed payloads (committed; not human-edited)
- `tests/` — Vitest suites, one spec per source module
- `scripts/` — data rebuild scripts (CommonJS); NOT shipped on npm (not in `files`). Excluded from `biome` and `tsc`. Run via `pnpm build:data` to regenerate `src/data/*.json` from `scripts/data/{countries.csv,country-capitals.json,locations.json}`.

## Public API (1.0.0 contract)
- 29 functions across 4 domains (capitals/countries — 12, locations — 6, states ANSI — 5, timezones — 6).
- 4 interfaces: `Capital`, `Country`, `Location`, `StateAnsi`.
- Two export shapes:
  - Named: `import { findCapitalOfCountryIso } from '@coroboros/location-timezone'`
  - Default merged object: `import locationTimezone from '@coroboros/location-timezone'` then `.findX(...)`

## Rules
- **NEVER** break the public API above. Signatures, return shapes, and `undefined`/`[]` "not found" semantics are the 1.0.0 contract.
- **NEVER** add a runtime dependency beyond `zipson` without user approval.
- **NEVER** use `axios`, `request`, or `node-fetch` — use native `fetch` (Node 22+).
- **NEVER** mutate the arrays returned from `getCountries`, `getCapitals`, `getLocations`, `getStatesAnsi`, `getTimezones`, `getCountryIso2Codes`, `getCountryIso3Codes` — they are shared references to internal data.
- Empty string `''` is the standard "absent" marker on `Capital`/`Country`/`Location`/`StateAnsi` string fields. Never substitute `null` or `undefined`.
- Run `pnpm lint && pnpm typecheck && pnpm test` before every commit.
- Scoped package — `publishConfig.access = "public"` is mandatory, do not remove.
- `scripts/` is the only place that uses `country-locale-map`; `tests/` is the only place that uses `joi`. Both stay in `devDependencies`.
