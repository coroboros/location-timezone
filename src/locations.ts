import { isValidCountryIso } from './countries.js';
import {
  EMPTY_LOCATIONS,
  locations,
  locationsByCountryLowerName,
  locationsByCountryLowerOfficialName,
  locationsByIso2,
  locationsByIso3,
  locationsByLowerProvince,
  locationsByLowerState,
} from './data/locations.js';
import { match } from './helpers.js';
import type { Coordinates, Location } from './interfaces.js';

const freezeArray = (arr: Location[]): ReadonlyArray<Location> => {
  Object.freeze(arr);
  return arr;
};

/**
 * Find locations within a bounding box. At least one latitude bound and one
 * longitude bound must be set; missing bounds default to `±Infinity`.
 */
export const findLocationsByCoordinates = ({
  latitudeFrom,
  latitudeTo,
  longitudeFrom,
  longitudeTo,
}: Coordinates): ReadonlyArray<Location> => {
  const latFromDefined = typeof latitudeFrom === 'number';
  const latToDefined = typeof latitudeTo === 'number';
  const longFromDefined = typeof longitudeFrom === 'number';
  const longToDefined = typeof longitudeTo === 'number';

  if ((!latFromDefined && !latToDefined) || (!longFromDefined && !longToDefined)) {
    return EMPTY_LOCATIONS;
  }

  const latFrom = latFromDefined ? latitudeFrom : Number.NEGATIVE_INFINITY;
  const latTo = latToDefined ? latitudeTo : Number.POSITIVE_INFINITY;
  const longFrom = longFromDefined ? longitudeFrom : Number.NEGATIVE_INFINITY;
  const longTo = longToDefined ? longitudeTo : Number.POSITIVE_INFINITY;

  return freezeArray(
    locations.filter(
      (location) =>
        location.latitude >= latFrom &&
        location.latitude <= latTo &&
        location.longitude >= longFrom &&
        location.longitude <= longTo,
    ),
  );
};

/**
 * Find locations by ISO 3166-1 alpha-2 or alpha-3 code. Case-insensitive.
 */
export const findLocationsByCountryIso = (code: string): ReadonlyArray<Location> => {
  if (typeof code !== 'string') {
    return EMPTY_LOCATIONS;
  }
  const upper = code.toUpperCase();
  const { valid, iso2 } = isValidCountryIso(upper);
  if (!valid) {
    return EMPTY_LOCATIONS;
  }
  return (iso2 ? locationsByIso2.get(upper) : locationsByIso3.get(upper)) ?? EMPTY_LOCATIONS;
};

/**
 * Find locations by country short or official name. Case-insensitive.
 */
export const findLocationsByCountryName = (
  name: string,
  partialMatch: boolean = false,
): ReadonlyArray<Location> => {
  if (typeof name !== 'string') {
    return EMPTY_LOCATIONS;
  }
  if (partialMatch === true) {
    return freezeArray(
      locations.filter(
        (location) =>
          match({
            partial: true,
            source: location.country.name,
            compare: name,
            strict: false,
          }) ||
          match({
            partial: true,
            source: location.country.officialName,
            compare: name,
            strict: false,
          }),
      ),
    );
  }
  const lower = name.toLowerCase();
  return (
    locationsByCountryLowerName.get(lower) ??
    locationsByCountryLowerOfficialName.get(lower) ??
    EMPTY_LOCATIONS
  );
};

/**
 * Find locations by province. Case-insensitive. Province data is not
 * exhaustively verified — treat partial matches as best-effort.
 */
export const findLocationsByProvince = (
  name: string,
  partialMatch: boolean = false,
): ReadonlyArray<Location> => {
  if (typeof name !== 'string') {
    return EMPTY_LOCATIONS;
  }
  if (partialMatch === true) {
    return freezeArray(
      locations.filter((location) =>
        match({
          partial: true,
          source: location.province,
          compare: name,
          strict: false,
        }),
      ),
    );
  }
  return locationsByLowerProvince.get(name.toLowerCase()) ?? EMPTY_LOCATIONS;
};

/**
 * Find locations by USPS state name or code (US only). Case-insensitive.
 */
export const findLocationsByState = (
  name: string,
  partialMatch: boolean = false,
): ReadonlyArray<Location> => {
  if (typeof name !== 'string') {
    return EMPTY_LOCATIONS;
  }
  if (partialMatch === true) {
    return freezeArray(
      locations.filter((location) =>
        match({
          partial: true,
          source: location.state,
          compare: name,
          strict: false,
        }),
      ),
    );
  }
  return locationsByLowerState.get(name.toLowerCase()) ?? EMPTY_LOCATIONS;
};

/**
 * All locations, sorted by city name ascending.
 */
export const getLocations = (): ReadonlyArray<Location> => locations;
