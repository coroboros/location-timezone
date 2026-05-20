/**
 * Data cleaner and file generator.
 *
 * Reads the raw inputs in `scripts/data/` and writes the zipson-compressed
 * payloads to `src/data/`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import clm from 'country-locale-map';
import { stringify } from 'zipson';
import countryIso2Codes from './country-iso2-codes.ts';
import countryIso3Codes from './country-iso3-codes.ts';
import generateCountries from './generate-countries.ts';
import statesAnsi from './states-ansi.ts';

const __dirname = import.meta.dirname;

interface RawLocation {
  city: string;
  cityAscii: string;
  country: string;
  countryIso2: string;
  countryIso3: string;
  latitude: number;
  longitude: number;
  province: string;
  state?: string;
  stateAnsi?: string;
  timezone: string;
}

interface RawCountryCapital {
  country: string;
  capital: string;
}

interface CountryAccum {
  name: string;
  officialName: string;
  iso2: string;
  iso3: string;
  timezones: Set<string> | string[];
  capital?: {
    name: string;
    nameAscii: string;
    latitude: number;
    longitude: number;
    province: string;
    state: string;
    timezone: string;
  };
}

const isString = (thing: unknown): thing is string => typeof thing === 'string';
const isNonEmptyString = (thing: unknown): thing is string => isString(thing) && thing.trim() !== '';
const isNumber = (thing: unknown): thing is number =>
  typeof thing === 'number' && !Number.isNaN(thing);
const isAscii = (str: string): boolean =>
  isNonEmptyString(str) && ![...str].some((char) => char.charCodeAt(0) > 127);

const dataDir = path.join(__dirname, 'data');
const outDir = path.join(__dirname, '..', 'src', 'data');

const timezones = Intl.supportedValuesOf('timeZone');
const countryCapitalsJson: RawCountryCapital[] = JSON.parse(
  readFileSync(path.join(dataDir, 'country-capitals.json'), 'utf8'),
);
const locationsJson: RawLocation[] = JSON.parse(
  readFileSync(path.join(dataDir, 'locations.json'), 'utf8'),
);

const countries: Record<string, CountryAccum> = {};
const countryCapitals: Record<string, Record<string, Record<string, unknown>>> = {};
const countryIso2ByIso3Codes: Record<string, string> = {};
const countryIso3ByIso2Codes: Record<string, string> = {};
const locations: Record<string, Record<string, Record<string, unknown>>> = {};

console.log('⏳ Cleaning data and building files...');

// NOTE: generate countries from the UN file
const countryFormalNamesByCountryName = generateCountries();
const countryNames = Object.keys(countryFormalNamesByCountryName);

// NOTE: write states ansi
writeFileSync(
  path.join(outDir, 'states-ansi.json'),
  JSON.stringify({ data: stringify(statesAnsi) }),
);

// NOTE: write ISO 3166-1 alpha-2 and alpha-3 codes files
writeFileSync(
  path.join(outDir, 'country-iso2-codes.json'),
  JSON.stringify({ data: stringify(countryIso2Codes) }),
);
writeFileSync(
  path.join(outDir, 'country-iso3-codes.json'),
  JSON.stringify({ data: stringify(countryIso3Codes) }),
);

// NOTE: write timezones file
writeFileSync(path.join(outDir, 'timezones.json'), JSON.stringify({ data: stringify(timezones) }));

// NOTE: check every countries iso2 are listed in files
const countryIso2CodesLocations = [...new Set(locationsJson.map((location) => location.countryIso2))];
for (const countryIso2 of countryIso2Codes) {
  if (!countryIso2CodesLocations.includes(countryIso2)) {
    console.error(`🚨 Missing country iso2 code ${countryIso2} in locations file`);
  }
}

// check every countries iso3 are listed in files
const countryIso3CodesLocations = [...new Set(locationsJson.map((location) => location.countryIso3))];
for (const countryIso3 of countryIso3Codes) {
  if (!countryIso3CodesLocations.includes(countryIso3)) {
    console.error(`🚨 Missing country iso3 code ${countryIso3} in locations file`);
  }
}

// check every states ansi are listed in the locations file
const states = [...new Set(locationsJson.map((location) => location.stateAnsi))];
for (const state of statesAnsi) {
  if (!states.includes(state.uspsCode)) {
    console.error(`🚨 Missing state ansi ${state.uspsCode} in locations file`);
  }
}

// get a list of all countries referenced in the countryCapitalsJson file
const countriesListIncountryCapitalsJson = [
  ...new Set(countryCapitalsJson.map((country) => country.country)),
];

// check every country is referenced in the UN list
for (const countryName of countriesListIncountryCapitalsJson) {
  if (!countryNames.includes(countryName)) {
    console.error(
      `🚨 Country with short name ${countryName} is in the countryCapitalsJson file but not in the official list`,
    );
  }
}

for (const countryName of countryNames) {
  if (!countriesListIncountryCapitalsJson.includes(countryName)) {
    console.error(
      `🚨 Country with short name ${countryName} is referenced in the official list but not in the countryCapitalsJson file`,
    );
  }
}

// NOTE: rebuild by sorting by country and check data
for (const location of locationsJson) {
  if (!isString(location.city)) {
    console.error(
      `🚨 Location error for country ${location.country}: location.city must be a string, got ${location.city}`,
    );
    continue;
  }

  if (!isString(location.cityAscii)) {
    console.error(
      `🚨 Location error for country ${location.country}: location.cityAscii must be a string, got ${location.cityAscii}`,
    );
    continue;
  }

  if (location.cityAscii && !isAscii(location.cityAscii)) {
    for (const char of location.cityAscii) {
      console.log(char, char.charCodeAt(0));
    }
    console.error(
      `🚨 Location error for country ${location.country}: location.cityAscii must only have ascii codes, got ${location.cityAscii}`,
    );
    continue;
  }

  if (!isNumber(location.latitude)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.latitude must be a number, got ${location.latitude}`,
    );
    continue;
  }

  if (!isNumber(location.longitude)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.longitude must be a number, got ${location.longitude}`,
    );
    continue;
  }

  if (!isNonEmptyString(location.country)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.country must be a non empty string, got ${location.country}`,
    );
    continue;
  }

  if (!isAscii(location.country)) {
    console.warn(
      `⚠️ Location warning for country ${location.country}: location.country has non Ascii characters, got ${location.country}`,
    );
  }

  if (!countryNames.includes(location.country)) {
    console.error(
      `🚨 Location error for country ${location.country}: location.country is not referenced in the official list`,
    );
    continue;
  }

  if (!countriesListIncountryCapitalsJson.includes(location.country)) {
    console.error(
      `🚨 Location error for country ${location.country}: location.country does not have a capital in countryCapitalsJson file`,
    );
    continue;
  }

  if (!isNonEmptyString(location.countryIso2)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso2 must be a non empty string, got ${location.countryIso2}`,
    );
    continue;
  }

  if (
    location.countryIso2.length !== 2 &&
    location.countryIso2.toUpperCase() !== location.countryIso2
  ) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso2 must only be two characters in uppercase, got ${location.countryIso2}`,
    );
    continue;
  }

  if (!countryIso2Codes.includes(location.countryIso2)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso2 must be a valid ISO 3166 Alpha2 code, got ${location.countryIso2}`,
    );
    continue;
  }

  if (!isNonEmptyString(location.countryIso3)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso3 must be a non empty string, got ${location.countryIso3}`,
    );
    continue;
  }

  if (
    location.countryIso3.length !== 2 &&
    location.countryIso3.toUpperCase() !== location.countryIso3
  ) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso3 must only be three characters in uppercase, got ${location.countryIso3}`,
    );
    continue;
  }

  if (!countryIso3Codes.includes(location.countryIso3)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso3 must be a valid ISO 3166 Alpha3 code, got ${location.countryIso3}`,
    );
    continue;
  }

  const iso2 = clm.getAlpha2ByAlpha3(location.countryIso3);
  const iso3 = clm.getAlpha3ByAlpha2(location.countryIso2);

  if (iso2 !== location.countryIso2 || iso3 !== location.countryIso3) {
    if (
      !['XC/CYN', 'XS/SOL', 'XK/KOS'].includes(`${location.countryIso2}/${location.countryIso3}`)
    ) {
      console.error(
        `🚨 Location error for country ${location.country} and city ${location.city}: countryIso2/countryIso3 pair is not valid, got ${location.countryIso2}/${location.countryIso3}`,
      );
      continue;
    }
  }

  if (!isString(location.province)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.province must be a string, got ${location.province}`,
    );
    continue;
  }

  if (location.countryIso3 === 'USA') {
    const found = statesAnsi.find((state) => state.uspsCode === location.stateAnsi);
    if (!found) {
      console.error(
        `🚨 Location error for country ${location.country} and city ${location.city}: invalid state ansi code, got ${location.state}`,
      );
      continue;
    }
    if (found.name !== location.province) {
      console.error(
        `🚨 Location error for country ${location.country} and city ${location.city}: invalid state province name for this ansi code, got ${location.province}`,
      );
      continue;
    }
  }

  if (!isNonEmptyString(location.timezone)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.timezone must be a non empty string, got ${location.timezone}`,
    );
    continue;
  }

  if (!timezones.includes(location.timezone)) {
    console.error(
      `🚨 Location error for country ${location.country} and city ${location.city}: location.timezone is not a supported timezone, got ${location.timezone}`,
    );
    continue;
  }

  if (!countries[location.country]) {
    countries[location.country] = {
      name: location.country,
      officialName: countryFormalNamesByCountryName[location.country],
      iso2: location.countryIso2,
      iso3: location.countryIso3,
      timezones: new Set<string>(),
    };
  }

  (countries[location.country].timezones as Set<string>).add(location.timezone);

  if (!locations[location.country]) {
    locations[location.country] = {};
  }

  locations[location.country][location.city] = {
    city: location.city,
    cityAscii: location.cityAscii,
    country: {},
    latitude: location.latitude,
    longitude: location.longitude,
    province: location.province,
    state: location.stateAnsi || location.state || '',
    timezone: location.timezone,
  };
}

const sortByLocalNameVariant = (a: string, b: string): number =>
  a.localeCompare(b, undefined, { sensitivity: 'variant' });

// convert timezones to array and sort countries timezones
for (const country of Object.keys(countries)) {
  countries[country].timezones = [...(countries[country].timezones as Set<string>).values()].sort(
    sortByLocalNameVariant,
  );
}

// NOTE: add country information attached to each location
// (after getting all the timezones for a specific country)
for (const country of Object.keys(locations)) {
  for (const location of Object.keys(locations[country])) {
    const c = { ...countries[country] };
    c.timezones = [...(countries[country].timezones as string[])];
    delete c.capital;
    locations[country][location].country = c;
  }
}

// NOTE: generate a clean version of countries capital based on the locations file
for (const country of countryCapitalsJson) {
  const found = locationsJson.filter(
    (location) =>
      location.country?.toLowerCase() === country.country?.toLowerCase() &&
      (location.city?.toLowerCase() === country.capital?.toLowerCase() ||
        location.cityAscii?.toLowerCase() === country.capital?.toLowerCase()),
  );

  if (found?.length !== 1) {
    console.error(
      `🚨 Country ${country.country} and its capital ${country.capital} not found in locationsJson file`,
    );
  }

  if (!countryCapitals[found[0].country]) {
    countryCapitals[found[0].country] = {};
  }

  countryCapitals[found[0].country][found[0].city] = {
    name: found[0].city,
    nameAscii: found[0].cityAscii,
    country: {
      name: found[0].country,
      officialName: countryFormalNamesByCountryName[found[0].country],
      iso2: found[0].countryIso2,
      iso3: found[0].countryIso3,
      timezones: [...(countries[found[0].country].timezones as string[])],
    },
    latitude: found[0].latitude,
    longitude: found[0].longitude,
    province: found[0].province,
    state: found[0].stateAnsi || found[0].state || '',
    timezone: found[0].timezone,
  };

  if (countries[found[0].country]) {
    countries[found[0].country].capital = {
      name: found[0].city,
      nameAscii: found[0].cityAscii,
      latitude: found[0].latitude,
      longitude: found[0].longitude,
      province: found[0].province,
      state: found[0].stateAnsi || found[0].state || '',
      timezone: found[0].timezone,
    };
    countries[found[0].country].timezones = [...(countries[found[0].country].timezones as string[])];
  }

  countryIso2ByIso3Codes[found[0].countryIso3] = found[0].countryIso2;
  countryIso3ByIso2Codes[found[0].countryIso2] = found[0].countryIso3;
}

if (Object.keys(countries).length !== Object.keys(countryCapitals).length) {
  console.error(
    `🚨 Found ${Object.keys(countries).length} countries but ${Object.keys(countryCapitals).length} countries are referenced with their capital`,
  );
}

// sort arrays by country name and then by city name
const countriesSorted = Object.keys(locations).sort(sortByLocalNameVariant);

const locationsSortedByCountryAndCity: Array<Record<string, unknown>> = [];
const countryCapitalsSortedByCountryAndCity: Array<Record<string, unknown>> = [];
const countriesSortedByName: CountryAccum[] = [];

for (const country of countriesSorted) {
  const citiesSorted = Object.keys(locations[country]).sort(sortByLocalNameVariant);
  for (const city of citiesSorted) {
    locationsSortedByCountryAndCity.push(locations[country][city]);
  }
  const capitalsSorted = Object.keys(countryCapitals[country]).sort(sortByLocalNameVariant);
  for (const capital of capitalsSorted) {
    countryCapitalsSortedByCountryAndCity.push(countryCapitals[country][capital]);
  }
  countriesSortedByName.push(countries[country]);
}

writeFileSync(
  path.join(outDir, 'locations.json'),
  JSON.stringify({ data: stringify(locationsSortedByCountryAndCity) }),
);

writeFileSync(
  path.join(outDir, 'country-capitals.json'),
  JSON.stringify({ data: stringify(countryCapitalsSortedByCountryAndCity) }),
);

writeFileSync(
  path.join(outDir, 'countries.json'),
  JSON.stringify({ data: stringify(countriesSortedByName) }),
);

writeFileSync(
  path.join(outDir, 'country-iso2-by-iso3-codes.json'),
  JSON.stringify({ data: stringify(countryIso2ByIso3Codes) }),
);

writeFileSync(
  path.join(outDir, 'country-iso3-by-iso2-codes.json'),
  JSON.stringify({ data: stringify(countryIso3ByIso2Codes) }),
);
