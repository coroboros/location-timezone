import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  findCapitalOfCountryIso,
  findCountryByIso,
  findCountryByName,
  getCapitals,
  getCountries,
  getCountryIso2CodeByIso3,
  getCountryIso2Codes,
  getCountryIso3CodeByIso2,
  getCountryIso3Codes,
  getLocations,
  getTimezones,
  isValidCountryIso,
} from '../src/index.js';

const ISO2_CODES = getCountryIso2Codes();
const ISO3_CODES = getCountryIso3Codes();

describe('property: ISO code round-trips', () => {
  it('iso2 → iso3 → iso2 is identity for every alpha-2 code', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ISO2_CODES), (iso2) => {
        const iso3 = getCountryIso3CodeByIso2(iso2);
        expect(iso3).toBeDefined();
        if (iso3 === undefined) {
          return;
        }
        expect(getCountryIso2CodeByIso3(iso3)).toBe(iso2);
      }),
      { numRuns: ISO2_CODES.length },
    );
  });

  it('iso3 → iso2 → iso3 is identity for every alpha-3 code', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ISO3_CODES), (iso3) => {
        const iso2 = getCountryIso2CodeByIso3(iso3);
        expect(iso2).toBeDefined();
        if (iso2 === undefined) {
          return;
        }
        expect(getCountryIso3CodeByIso2(iso2)).toBe(iso3);
      }),
      { numRuns: ISO3_CODES.length },
    );
  });
});

describe('property: closure', () => {
  it('every Country.iso2 in getCountries() is in getCountryIso2Codes()', () => {
    const iso2Set = new Set(ISO2_CODES);
    for (const country of getCountries()) {
      expect(iso2Set.has(country.iso2)).toBe(true);
    }
  });

  it('every Country.iso3 in getCountries() is in getCountryIso3Codes()', () => {
    const iso3Set = new Set(ISO3_CODES);
    for (const country of getCountries()) {
      expect(iso3Set.has(country.iso3)).toBe(true);
    }
  });

  it('every Country.timezones entry is in getTimezones()', () => {
    const tzSet = new Set(getTimezones());
    for (const country of getCountries()) {
      for (const tz of country.timezones) {
        expect(tzSet.has(tz)).toBe(true);
      }
    }
  });
});

describe('property: back-reference consistency', () => {
  it('every Capital.country.iso2 resolves via findCountryByIso', () => {
    for (const capital of getCapitals()) {
      expect(capital.country).toBeDefined();
      if (capital.country === undefined) {
        continue;
      }
      const country = findCountryByIso(capital.country.iso2);
      expect(country).toBeDefined();
      expect(country?.iso2).toBe(capital.country.iso2);
    }
  });

  it('every Location.country.iso2 resolves via findCountryByIso', () => {
    for (const location of getLocations()) {
      const country = findCountryByIso(location.country.iso2);
      expect(country).toBeDefined();
      expect(country?.iso2).toBe(location.country.iso2);
    }
  });
});

describe('property: case-insensitive find helpers', () => {
  it('findCountryByIso accepts any case', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ISO2_CODES), (iso2) => {
        const upper = findCountryByIso(iso2);
        const lower = findCountryByIso(iso2.toLowerCase());
        const mixed = findCountryByIso(`${iso2[0]}${iso2.slice(1).toLowerCase()}`);
        expect(upper).toBeDefined();
        expect(lower).toBe(upper);
        expect(mixed).toBe(upper);
      }),
    );
  });

  it('findCapitalOfCountryIso accepts any case', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ISO2_CODES), (iso2) => {
        const upper = findCapitalOfCountryIso(iso2);
        const lower = findCapitalOfCountryIso(iso2.toLowerCase());
        expect(lower).toBe(upper);
      }),
    );
  });
});

describe('property: isValidCountryIso reflexivity', () => {
  it('every alpha-2 code validates as iso2', () => {
    for (const code of ISO2_CODES) {
      const res = isValidCountryIso(code);
      expect(res.valid).toBe(true);
      expect(res.iso2).toBe(true);
      expect(res.iso3).toBe(false);
    }
  });

  it('every alpha-3 code validates as iso3', () => {
    for (const code of ISO3_CODES) {
      const res = isValidCountryIso(code);
      expect(res.valid).toBe(true);
      expect(res.iso2).toBe(false);
      expect(res.iso3).toBe(true);
    }
  });
});

describe('property: referential idempotency', () => {
  it('findCountryByIso returns the same reference across calls', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ISO2_CODES), (iso2) => {
        const a = findCountryByIso(iso2);
        const b = findCountryByIso(iso2);
        expect(a).toBe(b);
      }),
    );
  });
});

describe('property: find results live in get collections', () => {
  it('findCountryByName result is in getCountries() when defined', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const result = findCountryByName(name);
        if (result === undefined) {
          return;
        }
        expect(getCountries()).toContain(result);
      }),
    );
  });
});
