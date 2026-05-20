/**
 * Micro-benchmark for the lookup hot paths.
 *
 * Usage (from the package root):
 *   pnpm bench
 *
 * Inputs are deliberately late-alphabet to expose worst-case linear-scan cost
 * on the pre-optim baseline; post-optim Map/Set lookups are O(1) regardless
 * of input position.
 */
import { bench, group, run } from 'mitata';
import {
  findCapitalOfCountryIso,
  findCountryByIso,
  findCountryByName,
  findLocationsByCountryIso,
  findTimezoneByCityName,
  isValidCountryIso,
} from '../dist/index.mjs';

const LATE_ISO2 = 'ZW';
const LATE_ISO3 = 'ZWE';
const LATE_NAME = 'Zimbabwe';
const POPULOUS_ISO2 = 'US';
const LATE_CITY = 'Zurich';
const MISS_ISO = 'XX';

group('findCountryByIso', () => {
  bench('iso2 (hit, late)', () => {
    findCountryByIso(LATE_ISO2);
  });
  bench('iso3 (hit, late)', () => {
    findCountryByIso(LATE_ISO3);
  });
  bench('iso (miss)', () => {
    findCountryByIso(MISS_ISO);
  });
});

group('findCountryByName', () => {
  bench('exact (hit, late)', () => {
    findCountryByName(LATE_NAME);
  });
});

group('findCapitalOfCountryIso', () => {
  bench('iso2 (hit, late)', () => {
    findCapitalOfCountryIso(LATE_ISO2);
  });
});

group('findTimezoneByCityName', () => {
  bench('exact (hit, late)', () => {
    findTimezoneByCityName(LATE_CITY);
  });
});

group('findLocationsByCountryIso', () => {
  bench('populous (US)', () => {
    findLocationsByCountryIso(POPULOUS_ISO2);
  });
});

group('isValidCountryIso', () => {
  bench('iso2 (hit, late)', () => {
    isValidCountryIso(LATE_ISO2);
  });
  bench('iso3 (hit, late)', () => {
    isValidCountryIso(LATE_ISO3);
  });
  bench('miss', () => {
    isValidCountryIso(MISS_ISO);
  });
});

await run({ colors: true });
