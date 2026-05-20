import Joi from 'joi';
import { describe, expect, it } from 'vitest';
import locationTimezone from '../src/index.js';

const capitalSchema = Joi.object({
  name: Joi.string().allow('').min(2).required(),
  nameAscii: Joi.string()
    .allow('')
    // biome-ignore lint/suspicious/noControlCharactersInRegex: ASCII range validation
    .regex(/^[\x00-\x7F]+$/)
    .min(2)
    .required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  province: Joi.string().allow('').min(2).required(),
  state: Joi.string().allow('').min(2).required(),
  timezone: Joi.string().allow('').min(2).required(),
  country: Joi.object({
    name: Joi.string().min(2).required(),
    officialName: Joi.string().min(2).required(),
    iso2: Joi.string().min(2).max(2).required(),
    iso3: Joi.string().min(3).max(3).required(),
    timezones: Joi.array().items(Joi.string().required()).empty(Joi.array().length(0)).required(),
  }).required(),
});

const countrySchema = Joi.object({
  name: Joi.string().min(2).required(),
  officialName: Joi.string().min(2).required(),
  iso2: Joi.string().min(2).max(2).required(),
  iso3: Joi.string().min(3).max(3).required(),
  timezones: Joi.array().items(Joi.string().required()).empty(Joi.array().length(0)).required(),
  capital: Joi.object({
    name: Joi.string().allow('').min(2).required(),
    nameAscii: Joi.string()
      .allow('')
      // biome-ignore lint/suspicious/noControlCharactersInRegex: ASCII range validation
      .regex(/^[\x00-\x7F]+$/)
      .min(2)
      .required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    province: Joi.string().allow('').min(2).required(),
    state: Joi.string().allow('').min(2).required(),
    timezone: Joi.string().allow('').min(2).required(),
  }).required(),
});

const validCountryIsoSchema = Joi.object({
  valid: Joi.boolean().required(),
  iso2: Joi.boolean().required(),
  iso3: Joi.boolean().required(),
});

describe('findCapitalOfCountryIso', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findCapitalOfCountryIso('')).toBeUndefined();
  });

  it('should return a capital from iso2', () => {
    const capital = locationTimezone.findCapitalOfCountryIso('JP');
    expect(capital).not.toBeUndefined();
    expect(capital?.name).toBe('Tokyo');
    expect(capitalSchema.validate(capital).error).toBeUndefined();
  });

  it('should return a capital from iso3', () => {
    const capital = locationTimezone.findCapitalOfCountryIso('JPN');
    expect(capital).not.toBeUndefined();
    expect(capital?.name).toBe('Tokyo');
    expect(capitalSchema.validate(capital).error).toBeUndefined();
  });

  it('should ignore case', () => {
    const capital1 = locationTimezone.findCapitalOfCountryIso('jp');
    const capital2 = locationTimezone.findCapitalOfCountryIso('jpN');
    expect(capital1).not.toBeUndefined();
    expect(capital1?.name).toBe('Tokyo');
    expect(capitalSchema.validate(capital1).error).toBeUndefined();
    expect(capital2).not.toBeUndefined();
    expect(capital2?.name).toBe('Tokyo');
    expect(capitalSchema.validate(capital2).error).toBeUndefined();
  });

  it('should return an empty capital if the country does not have one', () => {
    const capital = locationTimezone.findCapitalOfCountryIso('BVT');
    expect(capital).not.toBeUndefined();
    expect(capital?.name).toBe('');
    expect(capitalSchema.validate(capital).error).toBeUndefined();
  });
});

describe('findCapitalOfCountryName', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findCapitalOfCountryName('')).toBeUndefined();
  });

  it('should return a capital with short name', () => {
    const capital = locationTimezone.findCapitalOfCountryName('British Indian Ocean Territory');
    expect(capital).not.toBeUndefined();
    expect(capital?.name).toBe('Diego Garcia');
    expect(capitalSchema.validate(capital).error).toBeUndefined();
  });

  it('should return a capital with official name', () => {
    const capital = locationTimezone.findCapitalOfCountryName('The British Indian Ocean Territory');
    expect(capital).not.toBeUndefined();
    expect(capital?.name).toBe('Diego Garcia');
    expect(capitalSchema.validate(capital).error).toBeUndefined();
  });

  it('should ignore case', () => {
    const capital1 = locationTimezone.findCapitalOfCountryName(
      'thE british Indian Ocean territory',
    );
    const capital2 = locationTimezone.findCapitalOfCountryName('british indian ocean territory');
    expect(capital1).not.toBeUndefined();
    expect(capital1?.name).toBe('Diego Garcia');
    expect(capitalSchema.validate(capital1).error).toBeUndefined();
    expect(capital2).not.toBeUndefined();
    expect(capital2?.name).toBe('Diego Garcia');
    expect(capitalSchema.validate(capital2).error).toBeUndefined();
  });

  it('should return an empty capital if the country does not have one', () => {
    const capital = locationTimezone.findCapitalOfCountryName(
      'The Territory of Heard Island and McDonald Islands',
    );
    expect(capital).not.toBeUndefined();
    expect(capital?.name).toBe('');
    expect(capitalSchema.validate(capital).error).toBeUndefined();
  });
});

describe('findCountryByCapitalName', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findCountryByCapitalName('')).toBeUndefined();
  });

  it('should return a country', () => {
    const country = locationTimezone.findCountryByCapitalName('Diego Garcia');
    expect(country).not.toBeUndefined();
    expect(country?.name).toBe('British Indian Ocean Territory');
    expect(countrySchema.validate(country).error).toBeUndefined();
  });

  it('should ignore case', () => {
    const country1 = locationTimezone.findCountryByCapitalName('Diego Garcia');
    const country2 = locationTimezone.findCountryByCapitalName('diego garcia');
    expect(country1).not.toBeUndefined();
    expect(country1?.name).toBe('British Indian Ocean Territory');
    expect(countrySchema.validate(country1).error).toBeUndefined();
    expect(country2).not.toBeUndefined();
    expect(country2?.name).toBe('British Indian Ocean Territory');
    expect(countrySchema.validate(country2).error).toBeUndefined();
  });
});

describe('findCountryByIso', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findCountryByIso('')).toBeUndefined();
  });

  it('should return a country from iso2', () => {
    const country = locationTimezone.findCountryByIso('BF');
    expect(country).not.toBeUndefined();
    expect(country?.name).toBe('Burkina Faso');
    expect(countrySchema.validate(country).error).toBeUndefined();
  });

  it('should return a country from iso3', () => {
    const country = locationTimezone.findCountryByIso('BFA');
    expect(country).not.toBeUndefined();
    expect(country?.name).toBe('Burkina Faso');
    expect(countrySchema.validate(country).error).toBeUndefined();
  });

  it('should ignore case', () => {
    const country1 = locationTimezone.findCountryByIso('cL');
    const country2 = locationTimezone.findCountryByIso('ChL');
    expect(country1).not.toBeUndefined();
    expect(country1?.name).toBe('Chile');
    expect(countrySchema.validate(country1).error).toBeUndefined();
    expect(country2).not.toBeUndefined();
    expect(country2?.name).toBe('Chile');
    expect(countrySchema.validate(country2).error).toBeUndefined();
  });
});

describe('findCountryByName', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findCountryByName('')).toBeUndefined();
  });

  it('should return a country with short name', () => {
    const country = locationTimezone.findCountryByName('Cocos (Keeling) Islands');
    expect(country).not.toBeUndefined();
    expect(country?.name).toBe('Cocos (Keeling) Islands');
    expect(countrySchema.validate(country).error).toBeUndefined();
  });

  it('should return a country with official name', () => {
    const country = locationTimezone.findCountryByName('The Territory of Cocos (Keeling) Islands');
    expect(country).not.toBeUndefined();
    expect(country?.officialName).toBe('The Territory of Cocos (Keeling) Islands');
    expect(countrySchema.validate(country).error).toBeUndefined();
  });

  it('should ignore case', () => {
    const country1 = locationTimezone.findCountryByName('Costa rica');
    const country2 = locationTimezone.findCountryByName('the Republic of Costa Rica');
    expect(country1).not.toBeUndefined();
    expect(country1?.name).toBe('Costa Rica');
    expect(countrySchema.validate(country1).error).toBeUndefined();
    expect(country2).not.toBeUndefined();
    expect(country2?.name).toBe('Costa Rica');
    expect(countrySchema.validate(country2).error).toBeUndefined();
  });
});

describe('getCapitals', () => {
  it('should return all the capitals', () => {
    const capitals = locationTimezone.getCapitals();
    expect(capitals).not.toBeUndefined();
    expect(Joi.array().items(capitalSchema).required().validate(capitals).error).toBeUndefined();
  });
});

describe('getCountries', () => {
  it('should return all the countries', () => {
    const countries = locationTimezone.getCountries();
    expect(countries).not.toBeUndefined();
    expect(Joi.array().items(countrySchema).required().validate(countries).error).toBeUndefined();
  });
});

describe('getCountryIso2CodeByIso3', () => {
  it('should return undefined if no code provided', () => {
    expect(locationTimezone.getCountryIso2CodeByIso3('')).toBeUndefined();
  });

  it('should return the correct iso2 code', () => {
    expect(locationTimezone.getCountryIso2CodeByIso3('THA')).toBe('TH');
  });
});

describe('getCountryIso2Codes', () => {
  it('should return all the iso2 codes', () => {
    const codes = locationTimezone.getCountryIso2Codes();
    expect(codes).not.toBeUndefined();
    expect(
      Joi.array().items(Joi.string().min(2).max(2).required()).required().validate(codes).error,
    ).toBeUndefined();
  });
});

describe('getCountryIso3CodeByIso2', () => {
  it('should return undefined if no code provided', () => {
    expect(locationTimezone.getCountryIso3CodeByIso2('')).toBeUndefined();
  });

  it('should return the correct iso3 code', () => {
    expect(locationTimezone.getCountryIso3CodeByIso2('TH')).toBe('THA');
  });
});

describe('getCountryIso3Codes', () => {
  it('should return all the iso3 codes', () => {
    const codes = locationTimezone.getCountryIso3Codes();
    expect(codes).not.toBeUndefined();
    expect(
      Joi.array().items(Joi.string().min(3).max(3).required()).required().validate(codes).error,
    ).toBeUndefined();
  });
});

describe('isValidCountryIso', () => {
  it('should return false if no code provided', () => {
    const res = locationTimezone.isValidCountryIso('');
    expect(validCountryIsoSchema.validate(res).error).toBeUndefined();
    expect(res.valid).toBe(false);
    expect(res.iso2).toBe(false);
    expect(res.iso3).toBe(false);
  });

  it('should return false if the iso2 code is unknown', () => {
    const res = locationTimezone.isValidCountryIso('XT');
    expect(validCountryIsoSchema.validate(res).error).toBeUndefined();
    expect(res.valid).toBe(false);
    expect(res.iso2).toBe(false);
    expect(res.iso3).toBe(false);
  });

  it('should return false if the iso3 code is unknown', () => {
    const res = locationTimezone.isValidCountryIso('TTT');
    expect(validCountryIsoSchema.validate(res).error).toBeUndefined();
    expect(res.valid).toBe(false);
    expect(res.iso2).toBe(false);
    expect(res.iso3).toBe(false);
  });

  it('should return false if the iso2 code is known but not in uppercase', () => {
    const res = locationTimezone.isValidCountryIso('Jp');
    expect(validCountryIsoSchema.validate(res).error).toBeUndefined();
    expect(res.valid).toBe(false);
    expect(res.iso2).toBe(false);
    expect(res.iso3).toBe(false);
  });

  it('should return false if the iso3 code is known but not in uppercase', () => {
    const res = locationTimezone.isValidCountryIso('JPn');
    expect(validCountryIsoSchema.validate(res).error).toBeUndefined();
    expect(res.valid).toBe(false);
    expect(res.iso2).toBe(false);
    expect(res.iso3).toBe(false);
  });

  it('should return false if the iso code is less than 2 characters', () => {
    const res = locationTimezone.isValidCountryIso('T');
    expect(validCountryIsoSchema.validate(res).error).toBeUndefined();
    expect(res.valid).toBe(false);
    expect(res.iso2).toBe(false);
    expect(res.iso3).toBe(false);
  });

  it('should return false if the iso code is more than 3 characters', () => {
    const res = locationTimezone.isValidCountryIso('TTTT');
    expect(validCountryIsoSchema.validate(res).error).toBeUndefined();
    expect(res.valid).toBe(false);
    expect(res.iso2).toBe(false);
    expect(res.iso3).toBe(false);
  });

  it('should return true if the iso2 code is valid', () => {
    const res = locationTimezone.isValidCountryIso('JP');
    expect(validCountryIsoSchema.validate(res).error).toBeUndefined();
    expect(res.valid).toBe(true);
    expect(res.iso2).toBe(true);
    expect(res.iso3).toBe(false);
  });

  it('should return true if the iso3 code is valid', () => {
    const res = locationTimezone.isValidCountryIso('JPN');
    expect(validCountryIsoSchema.validate(res).error).toBeUndefined();
    expect(res.valid).toBe(true);
    expect(res.iso2).toBe(false);
    expect(res.iso3).toBe(true);
  });
});
