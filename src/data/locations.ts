import { parse } from 'zipson';
import type { Location } from '../interfaces.js';
import locationsJson from './locations.json' with { type: 'json' };

export const locations = parse(locationsJson.data) as Location[];
Object.freeze(locations);

export const locationByCityLowerName = new Map<string, Location>();
export const locationsByCountryLowerName = new Map<string, Location[]>();
export const locationsByCountryLowerOfficialName = new Map<string, Location[]>();
export const locationsByIso2 = new Map<string, Location[]>();
export const locationsByIso3 = new Map<string, Location[]>();
export const locationsByLowerProvince = new Map<string, Location[]>();
export const locationsByLowerState = new Map<string, Location[]>();

const pushBucket = (map: Map<string, Location[]>, key: string, location: Location): void => {
  const bucket = map.get(key);
  if (bucket) {
    bucket.push(location);
    return;
  }
  map.set(key, [location]);
};

for (const location of locations) {
  if (location.city) {
    const lowerCity = location.city.toLowerCase();
    if (!locationByCityLowerName.has(lowerCity)) {
      locationByCityLowerName.set(lowerCity, location);
    }
  }
  if (location.cityAscii) {
    const lowerCityAscii = location.cityAscii.toLowerCase();
    if (!locationByCityLowerName.has(lowerCityAscii)) {
      locationByCityLowerName.set(lowerCityAscii, location);
    }
  }
  pushBucket(locationsByCountryLowerName, location.country.name.toLowerCase(), location);
  pushBucket(
    locationsByCountryLowerOfficialName,
    location.country.officialName.toLowerCase(),
    location,
  );
  pushBucket(locationsByIso2, location.country.iso2, location);
  pushBucket(locationsByIso3, location.country.iso3, location);
  // Province and state can be empty strings — index them as the '' bucket so
  // `findLocationsByProvince('')` / `findLocationsByState('')` returns the
  // matching subset (preserves pre-optim behavior).
  pushBucket(locationsByLowerProvince, location.province.toLowerCase(), location);
  pushBucket(locationsByLowerState, location.state.toLowerCase(), location);
}

const freezeBuckets = (map: Map<string, Location[]>): void => {
  for (const bucket of map.values()) {
    Object.freeze(bucket);
  }
};

freezeBuckets(locationsByCountryLowerName);
freezeBuckets(locationsByCountryLowerOfficialName);
freezeBuckets(locationsByIso2);
freezeBuckets(locationsByIso3);
freezeBuckets(locationsByLowerProvince);
freezeBuckets(locationsByLowerState);

export const EMPTY_LOCATIONS: Location[] = [];
Object.freeze(EMPTY_LOCATIONS);
