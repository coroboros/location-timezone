import {
  countries,
  countryCapitals,
  countryIso2ByIso3Codes,
  countryIso2Codes,
  countryIso3ByIso2Codes,
  countryIso3Codes,
} from './data/index.js';
import { is, isValidCountryIso, match } from './helpers.js';
import type { Capital, Country } from './interfaces.js';

/**
 * @func findCapitalOfCountryIso Find the capital of a country by its
 * country ISO 3166-1 alpha-2 or alpha-3 code.
 *
 * @param  {string}  code  Country ISO code (case insensitive)
 * @return {Capital|undefined}
 */
export const findCapitalOfCountryIso = function findCapitalOfCountryIso(
  code: string,
): Capital | undefined {
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
      compare: code,
      partial: false,
      strict: false,
    }),
  );
};

/**
 * @func findCapitalOfCountryName Find the capital of a country by its name.
 *
 * @param  {string}  name  Country name (case insensitive)
 * @return {Capital|undefined}
 */
export const findCapitalOfCountryName = function findCapitalOfCountryName(
  name: string,
): Capital | undefined {
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
  );
};

/**
 * @func findCountryByCapitalName Find a country by its capital name.
 *
 * @param  {string}  name  Capital name (case insensitive, utf-8 or ascii)
 * @return {Country|undefined}
 */
export const findCountryByCapitalName = function findCountryByCapitalName(
  name: string,
): Country | undefined {
  if (!is(String, name) || name.trim() === '') {
    return undefined;
  }

  return countries.find(
    (country) =>
      match({
        source: country.capital!.name,
        compare: name,
        partial: false,
        strict: false,
      }) ||
      match({
        source: country.capital!.nameAscii,
        compare: name,
        partial: false,
        strict: false,
      }),
  );
};

/**
 * @func findCountryByIso Find a country by its country ISO 3166-1 alpha-2 or alpha-3 code.
 *
 * @param  {string}  code  Country ISO code (case insensitive)
 * @return {Country|undefined}
 */
export const findCountryByIso = function findCountryByIso(code: string): Country | undefined {
  if (!is(String, code)) {
    return undefined;
  }

  const countryCode = code.toUpperCase();
  const { valid, iso2 } = isValidCountryIso(countryCode);

  if (!valid) {
    return undefined;
  }

  const alphaType = iso2 ? 'iso2' : 'iso3';

  return countries.find((country) =>
    match({
      source: country[alphaType],
      compare: code,
      partial: false,
      strict: false,
    }),
  );
};

/**
 * @func findCountryByName Find a country by its name.
 *
 * @param  {string}  name  Country name (case insensitive)
 * @return {Country|undefined}
 */
export const findCountryByName = function findCountryByName(name: string): Country | undefined {
  if (!is(String, name)) {
    return undefined;
  }

  return countries.find(
    (country) =>
      match({
        source: country.name,
        compare: name,
        partial: false,
        strict: false,
      }) ||
      match({
        source: country.officialName,
        compare: name,
        partial: false,
        strict: false,
      }),
  );
};

/**
 * @func getCapitals Get all country capitals.
 *
 * @return  {Capital[]}
 */
export const getCapitals = function getCapitals(): Capital[] {
  return countryCapitals;
};

/**
 * @func getCountries Get all countries.
 *
 * @return  {Country[]}
 */
export const getCountries = function getCountries(): Country[] {
  return countries;
};

/**
 * @func getCountryIso2CodeByIso3 Get the country ISO 3166-1 alpha-2 code
 * related to an alpha-3 code.
 *
 * @param  {string}  iso3  Country ISO 3166-1 alpha-3 code (case insensitive)
 * @return {string|undefined}
 */
export const getCountryIso2CodeByIso3 = function getCountryIso2CodeByIso3(
  iso3: string,
): string | undefined {
  if (!is(String, iso3)) {
    return undefined;
  }

  return countryIso2ByIso3Codes[iso3.toUpperCase()];
};

/**
 * @func getCountryIso2Codes Get all country ISO 3166-1 alpha-2 codes.
 *
 * @return  {string[]}
 */
export const getCountryIso2Codes = function getCountryIso2Codes(): string[] {
  return countryIso2Codes;
};

/**
 * @func getCountryIso3CodeByIso2 Get the country ISO 3166-1 alpha-2 code
 * related to an alpha-3 code.
 *
 * @param  {string}  iso2  Country ISO 3166-1 alpha-2 code (case insensitive)
 * @return {string|undefined}
 */
export const getCountryIso3CodeByIso2 = function getCountryIso3CodeByIso2(
  iso2: string,
): string | undefined {
  if (!is(String, iso2)) {
    return undefined;
  }

  return countryIso3ByIso2Codes[iso2.toUpperCase()];
};

/**
 * @func getCountryIso3Codes Get all country ISO 3166-1 alpha-3 codes.
 *
 * @return  {string[]}
 */
export const getCountryIso3Codes = function getCountryIso3Codes(): string[] {
  return countryIso3Codes;
};

// see helpers
export { isValidCountryIso };
