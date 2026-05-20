import { locations } from './data/index.js';
import { exists, is, isValidCountryIso, match } from './helpers.js';
import type { Location } from './interfaces.js';

/**
 * Find locations within a bounding box. At least one latitude and one longitude bound
 * must be set; missing bounds default to `±Infinity`.
 */
export const findLocationsByCoordinates = function findLocationsByCoordinates({
  latitudeFrom,
  latitudeTo,
  longitudeFrom,
  longitudeTo,
}: {
  latitudeFrom?: number;
  latitudeTo?: number;
  longitudeFrom?: number;
  longitudeTo?: number;
}): Location[] {
  const latFrom = is(Number, latitudeFrom) ? latitudeFrom : Number.NEGATIVE_INFINITY;
  const latTo = is(Number, latitudeTo) ? latitudeTo : Number.POSITIVE_INFINITY;
  const longFrom = is(Number, longitudeFrom) ? longitudeFrom : Number.NEGATIVE_INFINITY;
  const longTo = is(Number, longitudeTo) ? longitudeTo : Number.POSITIVE_INFINITY;

  // at least one of each value is necessary
  if (
    (!exists(latitudeFrom) && !exists(latitudeTo)) ||
    (!exists(longitudeFrom) && !exists(longitudeTo))
  ) {
    return [];
  }

  const res = locations.filter(
    (location) =>
      location.latitude >= latFrom &&
      location.latitude <= latTo &&
      location.longitude >= longFrom &&
      location.longitude <= longTo,
  );

  return res;
};

/**
 * @func findLocationsByCountryIso Find locations based on a country ISO 3166-1 alpha-2
 * or alpha-3 code.
 *
 * @param   {string}  code  Country ISO code (case insensitive)
 * @return  {Location[]}
 */
export const findLocationsByCountryIso = function findLocationsByCountryIso(
  code: string,
): Location[] {
  if (!is(String, code)) {
    return [];
  }

  const countryCode = code.toUpperCase();
  const { valid, iso2 } = isValidCountryIso(countryCode);

  if (!valid) {
    return [];
  }

  const alphaType = iso2 ? 'iso2' : 'iso3';
  const res = locations.filter((location) =>
    match({
      source: location.country[alphaType],
      compare: countryCode,
      partial: false,
      strict: true,
    }),
  );

  return res;
};

/**
 * @func findLocationsByCountryName Find locations based on a country name.
 *
 * @param   {string}        name     Country name (case insensitive)
 * @param   {boolean}       partialMatch  Whether to include partial matches
 * @return  {Location[]}
 */
export const findLocationsByCountryName = function findLocationsByCountryName(
  name: string,
  partialMatch: boolean = false,
): Location[] {
  if (!is(String, name)) {
    return [];
  }

  const partial = partialMatch === true;
  const res = locations.filter(
    (location) =>
      match({
        partial,
        source: location.country.name,
        compare: name,
        strict: false,
      }) ||
      match({
        partial,
        source: location.country.officialName,
        compare: name,
        strict: false,
      }),
  );

  return res;
};

/**
 * @func findLocationsByProvince Find locations based on a province
 * (not recommended, unreliable data).
 *
 * @param   {string}        name  Province name (case insensitive)
 * @param   {boolean}       partialMatch Whether to include partial matches
 * @return  {Location[]}
 */
export const findLocationsByProvince = function findLocationsByProvince(
  name: string,
  partialMatch: boolean = false,
): Location[] {
  if (!is(String, name)) {
    return [];
  }

  const partial = partialMatch === true;
  const res = locations.filter((location) =>
    match({
      partial,
      source: location.province,
      compare: name,
      strict: false,
    }),
  );

  return res;
};

/**
 * @func findLocationsByState Find locations based on the state name.
 *
 * @param   {string}          name  State name (case insensitive, 2 chars)
 * @param   {boolean}         partialMatch  Whether to include partial matches
 * @return  {Location[]}
 */
export const findLocationsByState = function findLocationsByState(
  name: string,
  partialMatch: boolean = false,
): Location[] {
  if (!is(String, name)) {
    return [];
  }

  const partial = partialMatch === true;
  const res = locations.filter((location) =>
    match({
      partial,
      source: location.state,
      compare: name,
      strict: false,
    }),
  );

  return res;
};

/**
 * @func getLocations Get all locations.
 *
 * @return  {Location[]}
 */
export const getLocations = function getLocations(): Location[] {
  return locations;
};
