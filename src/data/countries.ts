import { parse } from 'zipson';
import type { Capital, Country } from '../interfaces.js';
import countriesJson from './countries.json' with { type: 'json' };
import countryCapitalsJson from './country-capitals.json' with { type: 'json' };
import countryIso2ByIso3CodesJson from './country-iso2-by-iso3-codes.json' with { type: 'json' };
import countryIso2CodesJson from './country-iso2-codes.json' with { type: 'json' };
import countryIso3ByIso2CodesJson from './country-iso3-by-iso2-codes.json' with { type: 'json' };
import countryIso3CodesJson from './country-iso3-codes.json' with { type: 'json' };

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

Object.freeze(countries);
Object.freeze(countryCapitals);
Object.freeze(countryIso2Codes);
Object.freeze(countryIso3Codes);
Object.freeze(countryIso2ByIso3Codes);
Object.freeze(countryIso3ByIso2Codes);

export const countryByIso2 = new Map<string, CountryWithCapital>();
export const countryByIso3 = new Map<string, CountryWithCapital>();
export const countryByLowerName = new Map<string, CountryWithCapital>();
export const countryByLowerOfficialName = new Map<string, CountryWithCapital>();

for (const country of countries) {
  Object.freeze(country.timezones);
  countryByIso2.set(country.iso2, country);
  countryByIso3.set(country.iso3, country);
  countryByLowerName.set(country.name.toLowerCase(), country);
  countryByLowerOfficialName.set(country.officialName.toLowerCase(), country);
}

export const capitalByIso2 = new Map<string, CapitalWithCountry>();
export const capitalByIso3 = new Map<string, CapitalWithCountry>();
export const capitalByCountryLowerName = new Map<string, CapitalWithCountry>();
export const capitalByCountryLowerOfficialName = new Map<string, CapitalWithCountry>();
export const countryByCapitalLowerName = new Map<string, CountryWithCapital>();

for (const capital of countryCapitals) {
  Object.freeze(capital.country.timezones);
  capitalByIso2.set(capital.country.iso2, capital);
  capitalByIso3.set(capital.country.iso3, capital);
  capitalByCountryLowerName.set(capital.country.name.toLowerCase(), capital);
  capitalByCountryLowerOfficialName.set(capital.country.officialName.toLowerCase(), capital);
  if (!capital.name) {
    continue;
  }
  const country = countryByIso2.get(capital.country.iso2);
  if (!country) {
    continue;
  }
  const lowerName = capital.name.toLowerCase();
  if (!countryByCapitalLowerName.has(lowerName)) {
    countryByCapitalLowerName.set(lowerName, country);
  }
  if (capital.nameAscii) {
    const lowerAscii = capital.nameAscii.toLowerCase();
    if (lowerAscii !== lowerName && !countryByCapitalLowerName.has(lowerAscii)) {
      countryByCapitalLowerName.set(lowerAscii, country);
    }
  }
}

export const countryIso2Set = new Set<string>(countryIso2Codes);
export const countryIso3Set = new Set<string>(countryIso3Codes);
