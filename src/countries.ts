import {
  capitalByCountryLowerName,
  capitalByCountryLowerOfficialName,
  capitalByIso2,
  capitalByIso3,
  countries,
  countryByCapitalLowerName,
  countryByIso2,
  countryByIso3,
  countryByLowerName,
  countryByLowerOfficialName,
  countryCapitals,
  countryIso2ByIso3Codes,
  countryIso2Codes,
  countryIso2Set,
  countryIso3ByIso2Codes,
  countryIso3Codes,
  countryIso3Set,
} from './data/countries.js';
import type { Capital, Country } from './interfaces.js';

/**
 * Find the capital of a country by its ISO 3166-1 alpha-2 or alpha-3 code.
 * Case-insensitive.
 */
export const findCapitalOfCountryIso = (code: string): Capital | undefined => {
  if (typeof code !== 'string') {
    return undefined;
  }
  const upper = code.toUpperCase();
  const { valid, iso2 } = isValidCountryIso(upper);
  if (!valid) {
    return undefined;
  }
  return iso2 ? capitalByIso2.get(upper) : capitalByIso3.get(upper);
};

/**
 * Find the capital of a country by its short or official name. Case-insensitive.
 */
export const findCapitalOfCountryName = (name: string): Capital | undefined => {
  if (typeof name !== 'string') {
    return undefined;
  }
  const lower = name.toLowerCase();
  return capitalByCountryLowerName.get(lower) ?? capitalByCountryLowerOfficialName.get(lower);
};

/**
 * Find a country by its capital name (UTF-8 or ASCII). Case-insensitive.
 */
export const findCountryByCapitalName = (name: string): Country | undefined => {
  if (typeof name !== 'string' || name.trim() === '') {
    return undefined;
  }
  return countryByCapitalLowerName.get(name.toLowerCase());
};

/**
 * Find a country by its ISO 3166-1 alpha-2 or alpha-3 code. Case-insensitive.
 */
export const findCountryByIso = (code: string): Country | undefined => {
  if (typeof code !== 'string') {
    return undefined;
  }
  const upper = code.toUpperCase();
  const { valid, iso2 } = isValidCountryIso(upper);
  if (!valid) {
    return undefined;
  }
  return iso2 ? countryByIso2.get(upper) : countryByIso3.get(upper);
};

/**
 * Find a country by its short or official name. Case-insensitive.
 */
export const findCountryByName = (name: string): Country | undefined => {
  if (typeof name !== 'string') {
    return undefined;
  }
  const lower = name.toLowerCase();
  return countryByLowerName.get(lower) ?? countryByLowerOfficialName.get(lower);
};

/**
 * All country capitals, sorted by country name ascending.
 */
export const getCapitals = (): Capital[] => countryCapitals;

/**
 * All countries, sorted by country name ascending.
 */
export const getCountries = (): Country[] => countries;

/**
 * Get the ISO 3166-1 alpha-2 code paired with an alpha-3 code. Case-insensitive.
 */
export const getCountryIso2CodeByIso3 = (iso3: string): string | undefined => {
  if (typeof iso3 !== 'string') {
    return undefined;
  }
  return countryIso2ByIso3Codes[iso3.toUpperCase()];
};

/**
 * All ISO 3166-1 alpha-2 codes, sorted ascending.
 */
export const getCountryIso2Codes = (): string[] => countryIso2Codes;

/**
 * Get the ISO 3166-1 alpha-3 code paired with an alpha-2 code. Case-insensitive.
 */
export const getCountryIso3CodeByIso2 = (iso2: string): string | undefined => {
  if (typeof iso2 !== 'string') {
    return undefined;
  }
  return countryIso3ByIso2Codes[iso2.toUpperCase()];
};

/**
 * All ISO 3166-1 alpha-3 codes, sorted ascending.
 */
export const getCountryIso3Codes = (): string[] => countryIso3Codes;

/**
 * Validate an ISO 3166-1 alpha-2 or alpha-3 code. **Case-sensitive** — codes
 * must be uppercase.
 */
export const isValidCountryIso = (
  code: string,
): { valid: boolean; iso2: boolean; iso3: boolean } => {
  const res = { valid: false, iso2: false, iso3: false };
  if (typeof code !== 'string') {
    return res;
  }
  if (code.length < 2 || code.length > 3) {
    return res;
  }
  if (countryIso2Set.has(code)) {
    res.valid = true;
    res.iso2 = true;
    return res;
  }
  if (countryIso3Set.has(code)) {
    res.valid = true;
    res.iso3 = true;
    return res;
  }
  return res;
};
