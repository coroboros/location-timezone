import { countries, countryCapitals, locations, timezones } from './data/index.js';
import { exists, is, isValidCountryIso, match } from './helpers.js';

/**
 * @func findTimezoneByCapitalOfCountryIso Find a timezone based on the capital
 * of a country ISO 3166-1 alpha-2 or alpha-3 code.
 *
 * @param   {string}  code  Country ISO code (case insensitive)
 * @return  {string|undefined}
 */
export const findTimezoneByCapitalOfCountryIso = function findTimezoneByCapitalOfCountryIso(
  code: string,
): string | undefined {
  if (!is(String, code)) {
    return undefined;
  }

  const countryCode = code.toUpperCase();
  const { valid, iso2 } = isValidCountryIso(countryCode);

  if (!valid) {
    return undefined;
  }

  const alphaType = iso2 ? 'iso2' : 'iso3';
  return countryCapitals.find((capital) =>
    match({
      source: capital.country![alphaType],
      compare: countryCode,
      partial: false,
      strict: true,
    }),
  )?.timezone;
};

/**
 * @func findTimezoneByCapitalOfCountryName Find a timezone based on the capital
 * of a country (name).
 *
 * @param   {string}  name  Country name (case insensitive)
 * @return  {string|undefined}
 */
export const findTimezoneByCapitalOfCountryName = function findTimezoneByCapitalOfCountryName(
  name: string,
): string | undefined {
  if (!is(String, name)) {
    return undefined;
  }

  return countryCapitals.find(
    (capital) =>
      match({
        source: capital.country!.name,
        compare: name,
        partial: false,
        strict: false,
      }) ||
      match({
        source: capital.country!.officialName,
        compare: name,
        partial: false,
        strict: false,
      }),
  )?.timezone;
};

/**
 * @func findTimezoneByCityName Find a timezone based on a city name.
 *
 * @param   {string}  name  City name (case insensitive, utf-8 or ascii)
 * @return  {string|undefined}
 */
export const findTimezoneByCityName = function findTimezoneByCityName(
  name: string,
): string | undefined {
  if (!is(String, name) || name.trim() === '') {
    return undefined;
  }

  return locations.find(
    (location) =>
      match({
        source: location.city,
        compare: name,
        partial: false,
        strict: false,
      }) ||
      match({
        source: location.cityAscii,
        compare: name,
        partial: false,
        strict: false,
      }),
  )?.timezone;
};

/**
 * @func findTimezonesByCountryIso Find timezones based on a country
 * ISO 3166-1 alpha-2 or alpha-3 code.
 *
 * @param   {string}  code  Country ISO code (case insensitive)
 * @return  {string[]}
 */
export const findTimezonesByCountryIso = function findTimezonesByCountryIso(
  code: string,
): string[] {
  if (!is(String, code)) {
    return [];
  }

  const countryCode = code.toUpperCase();
  const { valid, iso2 } = isValidCountryIso(countryCode);

  if (!valid) {
    return [];
  }

  const alphaType = iso2 ? 'iso2' : 'iso3';

  const country = countries.find((c) =>
    match({
      source: c[alphaType],
      compare: code,
      partial: false,
      strict: false,
    }),
  );

  if (!exists(country)) {
    return [];
  }

  return country.timezones;
};

/**
 * @func findTimezonesByCountryName Find timezones based on a country name.
 *
 * @param   {string}  name  Country name (case insensitive)
 * @return  {string[]}
 */
export const findTimezonesByCountryName = function findTimezonesByCountryName(
  name: string,
): string[] {
  if (!is(String, name)) {
    return [];
  }

  const country = countries.find(
    (c) =>
      match({
        source: c.name,
        compare: name,
        partial: false,
        strict: false,
      }) ||
      match({
        source: c.officialName,
        compare: name,
        partial: false,
        strict: false,
      }),
  );

  if (!exists(country)) {
    return [];
  }

  return country.timezones;
};

/**
 * @func getTimezones Get all timezones.
 *
 * @return  {string[]}
 */
export const getTimezones = function getTimezones(): string[] {
  return timezones;
};
