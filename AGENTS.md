# @coroboros/location-timezone

Capital, country, city, ANSI state and IANA timezone lookups for Node.js 22+.

## Project constraints

- Preserve the public signatures, return shapes and import forms documented in `README.md`, `src/index.ts` and the domain entrypoints. Keep single-result `undefined` and multi-result `[]` semantics.
- Returned data and lookup buckets are frozen shared references. Missing string fields use `''`, not `null` or `undefined`.
- `zipson` is the sole runtime dependency; additions require user approval. Use native `fetch`. Keep `country-locale-map` confined to data scripts and `joi` to tests, both as development dependencies.
- Regenerate compressed `src/data/*.json` with `pnpm build:data`; do not edit the payloads manually. Data scripts are excluded from the shipped package, Biome and the TypeScript project.
- Preserve the public scoped package and dual ESM/CJS exports. Keep public artifacts free of private paths and infrastructure references.

## Validation

Use the scripts in `package.json`. Source or dependency changes require `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`; documentation-only edits need Markdown and reference checks.

For query-helper or data-layer changes, run `pnpm bench` against the bucket budgets in `bench/baseline.md`. Reuse passing results while the tested inputs remain unchanged.

## Release

Target `main` through a PR and squash-merge the reviewed head. After release approval, tag the merge commit with the next SemVer. `.github/workflows/ci.yml` delegates version updates, changelog, npm publication and GitHub release to the shared package pipeline; leave those generated artifacts to CI. Publishing uses OIDC with provenance; do not add an npm token or publish locally.
