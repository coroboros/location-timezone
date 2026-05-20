import { parse } from 'zipson';
import type { Capital, Country, Location, StateAnsi } from '../interfaces.js';
import countriesJson from './countries.json' with { type: 'json' };
import countryCapitalsJson from './country-capitals.json' with { type: 'json' };
import countryIso2ByIso3CodesJson from './country-iso2-by-iso3-codes.json' with { type: 'json' };
import countryIso2CodesJson from './country-iso2-codes.json' with { type: 'json' };
import countryIso3ByIso2CodesJson from './country-iso3-by-iso2-codes.json' with { type: 'json' };
import countryIso3CodesJson from './country-iso3-codes.json' with { type: 'json' };
import locationsJson from './locations.json' with { type: 'json' };
import statesAnsiJson from './states-ansi.json' with { type: 'json' };
import timezonesJson from './timezones.json' with { type: 'json' };

interface CapitalWithCountry extends Capital {
  country: Country;
}

interface CountryWithCapital extends Country {
  capital: Capital;
}

export const countries = parse(countriesJson.data) as CountryWithCapital[];
export const countryCapitals = parse(countryCapitalsJson.data) as CapitalWithCountry[];
export const countryIso2ByIso3Codes = parse(countryIso2ByIso3CodesJson.data) as Record<
  string,
  string
>;
export const countryIso2Codes = parse(countryIso2CodesJson.data) as string[];
export const countryIso3ByIso2Codes = parse(countryIso3ByIso2CodesJson.data) as Record<
  string,
  string
>;
export const countryIso3Codes = parse(countryIso3CodesJson.data) as string[];
export const locations = parse(locationsJson.data) as Location[];
export const statesAnsi = parse(statesAnsiJson.data) as StateAnsi[];
export const timezones = parse(timezonesJson.data) as string[];
