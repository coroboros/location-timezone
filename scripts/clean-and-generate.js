/**
 * Data Cleaner and File Generator
 */

/* eslint-disable no-console  */

const { writeFileSync } = require('fs');
const clm = require('country-locale-map');
const { stringify } = require('zipson');
const countryIso2Codes = require('./country-iso2-codes');
const countryIso3Codes = require('./country-iso3-codes');
const countryCapitalsJson = require('./data/country-capitals.json');
const generateCountries = require('./generate-countries');
const locationsJson = require('./data/locations.json');
const statesAnsi = require('./states-ansi');

// utils
const exists = (thing) => thing !== undefined && thing !== null && !Number.isNaN(thing);
const isString = (thing) => exists(thing) && thing.constructor === String;
const isNonEmptyString = (thing) => isString(thing) && thing.trim() !== '';
const isNumber = (thing) => exists(thing) && thing.constructor === Number;
const isAscii = (str) => isNonEmptyString(str)
  && ![...str].some((char) => char.charCodeAt(0) > 127);

const timezones = Intl.supportedValuesOf('timeZone');
const countries = {};
const countryCapitals = {};
const countryIso2ByIso3Codes = {};
const countryIso3ByIso2Codes = {};
const locations = {};

console.log('⏳ Cleaning data and building files...');

// NOTE: generate countries from the UN file
const countryFormalNamesByCountryName = generateCountries();
const countryNames = Object.keys(countryFormalNamesByCountryName);

// NOTE: write states ansi
writeFileSync(`${__dirname}/../src/data/states-ansi.json`, JSON.stringify({ data: stringify(statesAnsi) }));

// NOTE: write ISO 3611-1 alpha-2 and alpha-3 codes files
writeFileSync(`${__dirname}/../src/data/country-iso2-codes.json`, JSON.stringify({ data: stringify(countryIso2Codes) }));
writeFileSync(`${__dirname}/../src/data/country-iso3-codes.json`, JSON.stringify({ data: stringify(countryIso3Codes) }));

// NOTE: write timezones file
writeFileSync(`${__dirname}/../src/data/timezones.json`, JSON.stringify({ data: stringify(timezones) }));

// NOTE: check every countries iso2 are listed in files
const countryIso2CodesLocations = [...new Set(locationsJson.map((location) => location.countryIso2))];

countryIso2Codes.forEach((countryIso2) => {
  if (!countryIso2CodesLocations.includes(countryIso2)) {
    return console.error(`🚨 Missing country iso2 code ${countryIso2} in locations file`);
  }

  return true;
});

// check every countries iso3 are listed in files
const countryIso3CodesLocations = [...new Set(locationsJson.map((location) => location.countryIso3))];

countryIso3Codes.forEach((countryIso3) => {
  if (!countryIso3CodesLocations.includes(countryIso3)) {
    return console.error(`🚨 Missing country iso3 code ${countryIso3} in locations file`);
  }

  return true;
});

// check every states ansi are listed in the locations file
const states = [...new Set(locationsJson.map((location) => location.stateAnsi))];

statesAnsi.forEach((state) => {
  if (!states.includes(state.uspsCode)) {
    return console.error(`🚨 Missing state ansi ${state.uspsCode} in locations file`);
  }

  return true;
});

// get a list of all countries referenced in the countryCapitalsJson file
const countriesListIncountryCapitalsJson = [
  ...new Set(countryCapitalsJson.map((country) => country.country)),
];

// check every country is referenced in the UN list
countriesListIncountryCapitalsJson.forEach((countryName) => {
  if (!countryNames.includes(countryName)) {
    console.error(`🚨 Country with short name ${countryName} is in the countryCapitalsJson file but not in the official list`);
  }
});

countryNames.forEach((countryName, index) => {
  if (!countriesListIncountryCapitalsJson.includes(countryName)) {
    console.error(`🚨 Country with short name ${countryName} is referenced in the official list but not in the countryCapitalsJson file`);
  }
});

// NOTE: rebuild by sorting by country and check data
locationsJson.forEach((location) => {
  // check city
  if (!isString(location.city)) {
    return console.error(`🚨 Location error for country ${location.country}: location.city must be a string, got ${location.city}`);
  }

  // check cityAscii
  if (!isString(location.cityAscii)) {
    return console.error(`🚨 Location error for country ${location.country}: location.cityAscii must be a string, got ${location.cityAscii}`);
  }

  if (location.cityAscii && !isAscii(location.cityAscii)) {
    [...location.cityAscii].forEach((char) => console.log(char, char.charCodeAt(0)));
    return console.error(`🚨 Location error for country ${location.country}: location.cityAscii must only have ascii codes, got ${location.cityAscii}`);
  }

  // check latitude
  if (!isNumber(location.latitude)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.latitude must be a number, got ${location.latitude}`);
  }

  // check longitude
  if (!isNumber(location.longitude)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.longitude must be a number, got ${location.longitude}`);
  }

  // check country
  if (!isNonEmptyString(location.country)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.country must be a non empty string, got ${location.country}`);
  }

  if (!isAscii(location.country)) {
    console.warn(`⚠️ Location warning for country ${location.country}: location.country has non Ascii characters, got ${location.country}`);
  }

  // check every countries are present in the official list
  if (!countryNames.includes(location.country)) {
    return console.error(`🚨 Location error for country ${location.country}: location.country is not referenced in the official list`);
  }

  // check every countries are listed in countryCapitalsJson so we have all the capitals
  if (!countriesListIncountryCapitalsJson.includes(location.country)) {
    return console.error(`🚨 Location error for country ${location.country}: location.country does not have a capital in countryCapitalsJson file`);
  }

  // check countryIso2
  if (!isNonEmptyString(location.countryIso2)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso2 must be a non empty string, got ${location.countryIso2}`);
  }

  if (location.countryIso2.length !== 2
    && location.countryIso2.toUpperCase() !== location.countryIso2) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso2 must only be two characters in uppercase, got ${location.countryIso2}`);
  }

  if (!countryIso2Codes.includes(location.countryIso2)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso2 must be a valid ISO 3166 Alpha2 code, got ${location.countryIso2}`);
  }

  // check countryIso3
  if (!isNonEmptyString(location.countryIso3)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso3 must be a non empty string, got ${location.countryIso3}`);
  }

  if (location.countryIso3.length !== 2
    && location.countryIso3.toUpperCase() !== location.countryIso3) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso3 must only be three characters in uppercase, got ${location.countryIso3}`);
  }

  if (!countryIso3Codes.includes(location.countryIso3)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.countryIso3 must be a valid ISO 3166 Alpha3 code, got ${location.countryIso3}`);
  }

  // check every country iso2 and iso3 is a valid pair
  const iso2 = clm.getAlpha2ByAlpha3(location.countryIso3);
  const iso3 = clm.getAlpha3ByAlpha2(location.countryIso2);

  if (iso2 !== location.countryIso2 || iso3 !== location.countryIso3) {
    if (!['XC/CYN', 'XS/SOL', 'XK/KOS'].includes(`${location.countryIso2}/${location.countryIso3}`)) {
      return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: countryIso2/countryIso3 pair is not valid, got ${location.countryIso2}/${location.countryIso3}`);
    }
  }

  // check province
  if (!isString(location.province)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.province must be a string, got ${location.province}`);
  }

  // check stateAnsi
  if (location.countryIso3 === 'USA') {
    const found = statesAnsi.find((state) => state.uspsCode === location.stateAnsi);

    if (!found) {
      return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: invalid state ansi code, got ${location.state}`);
    }

    if (found.name !== location.province) {
      return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: invalid state province name for this ansi code, got ${location.province}`);
    }
  }

  // check timezone
  if (!isNonEmptyString(location.timezone)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.timezone must be a non empty string, got ${location.timezone}`);
  }

  if (!timezones.includes(location.timezone)) {
    return console.error(`🚨 Location error for country ${location.country} and city ${location.city}: location.timezone is not a supported timezone, got ${location.timezone}`);
  }

  // NOTE: build countries file
  if (!countries[location.country]) {
    countries[location.country] = {
      name: location.country,
      officialName: countryFormalNamesByCountryName[location.country],
      iso2: location.countryIso2,
      iso3: location.countryIso3,
      timezones: new Set(),
    };
  }

  countries[location.country].timezones.add(location.timezone);

  // build locations file data
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

  return true;
});

// sorting function
const sortByLocalNameVariant = (a, b) => a.localeCompare(b, { sensitivity: 'variant' });

// convert timezones to array and sort countries timezones
Object.keys(countries).forEach((country) => {
  countries[country].timezones = [...countries[country].timezones.values()].sort(sortByLocalNameVariant);
});

// NOTE: add country information attached to each location
// (after to get all the timezones for a specific country)
Object.keys(locations).forEach((country) => {
  Object.keys(locations[country]).forEach((location) => {
    locations[country][location].country = { ...countries[country] };
    locations[country][location].country.timezones = [...countries[country].timezones];
    delete locations[country][location].country.capital;
  });
});

// NOTE: generate a clean version of countries capital based on the locations file
countryCapitalsJson.forEach((country) => {
  const found = locationsJson.filter(
    (location) => location.country?.toLowerCase() === country.country?.toLowerCase()
      && (location.city?.toLowerCase() === country.capital?.toLowerCase()
        || location.cityAscii?.toLowerCase() === country.capital?.toLowerCase()),
  );

  if (found?.length !== 1) {
    console.error(`🚨 Country ${country.country} and its capital ${country.capital} not found in locationsJson file`);
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
      timezones: [...countries[found[0].country].timezones],
    },
    latitude: found[0].latitude,
    longitude: found[0].longitude,
    province: found[0].province,
    state: found[0].stateAnsi || found[0].state || '',
    timezone: found[0].timezone,
  };

  // countries only
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

    countries[found[0].country].timezones = [...countries[found[0].country].timezones];
  }

  // build country iso codes
  countryIso2ByIso3Codes[found[0].countryIso3] = found[0].countryIso2;
  countryIso3ByIso2Codes[found[0].countryIso2] = found[0].countryIso3;
});

// check we have the same amount of countries than countries capital
if (Object.keys(countries).length !== Object.keys(countryCapitals).length) {
  console.error(`🚨 Found ${Object.keys(countries).length} countries but ${Object.keys(countryCapitals).length} countries are referenced with their capital`);
}

// sort arrays by country name and then by city name
const countriesSorted = Object.keys(locations).sort(sortByLocalNameVariant);

const locationsSortedByCountryAndCity = [];
const countryCapitalsSortedByCountryAndCity = [];
const countriesSortedByName = [];

countriesSorted.forEach((country) => {
  const citiesSorted = Object.keys(locations[country]).sort(sortByLocalNameVariant);

  citiesSorted.forEach((city) => {
    locationsSortedByCountryAndCity.push(locations[country][city]);
  });

  const capitalsSorted = Object.keys(countryCapitals[country]).sort(sortByLocalNameVariant);

  capitalsSorted.forEach((capital) => {
    countryCapitalsSortedByCountryAndCity.push(countryCapitals[country][capital]);
  });

  countriesSortedByName.push(countries[country]);
});

// NOTE: write locations file
writeFileSync(`${__dirname}/../src/data/locations.json`, JSON.stringify({ data: stringify(locationsSortedByCountryAndCity) }));

// NOTE: write countries capital file
writeFileSync(`${__dirname}/../src/data/country-capitals.json`, JSON.stringify({ data: stringify(countryCapitalsSortedByCountryAndCity) }));

// NOTE: write countries file
writeFileSync(`${__dirname}/../src/data/countries.json`, JSON.stringify({ data: stringify(countriesSortedByName) }));

// NOTE: write country codes files
writeFileSync(`${__dirname}/../src/data/country-iso2-by-iso3-codes.json`, JSON.stringify({ data: stringify(countryIso2ByIso3Codes) }));
writeFileSync(`${__dirname}/../src/data/country-iso3-by-iso2-codes.json`, JSON.stringify({ data: stringify(countryIso3ByIso2Codes) }));
