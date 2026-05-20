import { isValidCountryIso } from './countries.js';
import {
  capitalByCountryLowerName,
  capitalByCountryLowerOfficialName,
  capitalByIso2,
  capitalByIso3,
  countryByIso2,
  countryByIso3,
  countryByLowerName,
  countryByLowerOfficialName,
} from './data/countries.js';
import { locationByCityLowerName } from './data/locations.js';
import { timezones } from './data/timezones.js';

/**
 * IANA timezone for a country's capital, by ISO 3166-1 alpha-2 or alpha-3 code.
 * Case-insensitive.
 */
export const findTimezoneByCapitalOfCountryIso = (code: string): string | undefined => {
  if (typeof code !== 'string') {
    return undefined;
  }
  const upper = code.toUpperCase();
  const { valid, iso2 } = isValidCountryIso(upper);
  if (!valid) {
    return undefined;
  }
  return (iso2 ? capitalByIso2.get(upper) : capitalByIso3.get(upper))?.timezone;
};

/**
 * IANA timezone for a country's capital, by country short or official name.
 * Case-insensitive.
 */
export const findTimezoneByCapitalOfCountryName = (name: string): string | undefined => {
  if (typeof name !== 'string') {
    return undefined;
  }
  const lower = name.toLowerCase();
  return (capitalByCountryLowerName.get(lower) ?? capitalByCountryLowerOfficialName.get(lower))
    ?.timezone;
};

/**
 * IANA timezone for a city, by name (UTF-8 or ASCII). Case-insensitive.
 */
export const findTimezoneByCityName = (name: string): string | undefined => {
  if (typeof name !== 'string' || name.trim() === '') {
    return undefined;
  }
  return locationByCityLowerName.get(name.toLowerCase())?.timezone;
};

const EMPTY_TIMEZONES: ReadonlyArray<string> = Object.freeze([]);

/**
 * All IANA timezones for a country, by ISO 3166-1 alpha-2 or alpha-3 code.
 * Case-insensitive.
 */
export const findTimezonesByCountryIso = (code: string): ReadonlyArray<string> => {
  if (typeof code !== 'string') {
    return EMPTY_TIMEZONES;
  }
  const upper = code.toUpperCase();
  const { valid, iso2 } = isValidCountryIso(upper);
  if (!valid) {
    return EMPTY_TIMEZONES;
  }
  const country = iso2 ? countryByIso2.get(upper) : countryByIso3.get(upper);
  return country?.timezones ?? EMPTY_TIMEZONES;
};

/**
 * All IANA timezones for a country, by country short or official name.
 * Case-insensitive.
 */
export const findTimezonesByCountryName = (name: string): ReadonlyArray<string> => {
  if (typeof name !== 'string') {
    return EMPTY_TIMEZONES;
  }
  const lower = name.toLowerCase();
  const country = countryByLowerName.get(lower) ?? countryByLowerOfficialName.get(lower);
  return country?.timezones ?? EMPTY_TIMEZONES;
};

/**
 * All IANA timezones (the subset returned by `Intl.supportedValuesOf('timeZone')`
 * at data-build time), sorted ascending.
 */
export const getTimezones = (): ReadonlyArray<string> => timezones;
