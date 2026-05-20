import Joi from 'joi';
import { describe, expect, it } from 'vitest';
import locationTimezone from '../src/index.js';

const locationSchema = Joi.object({
  city: Joi.string().allow('').min(2).required(),
  cityAscii: Joi.string()
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

describe('findLocationsByCoordinates', () => {
  it('should return the empty array when no parameters are provided', () => {
    expect(locationTimezone.findLocationsByCoordinates({})).toEqual([]);
  });

  it('should not return the empty array when at least one parameter for each boundary is provided', () => {
    expect(
      locationTimezone.findLocationsByCoordinates({
        latitudeFrom: 0,
        longitudeFrom: 0,
      }).length,
    ).toBeGreaterThan(0);

    expect(
      locationTimezone.findLocationsByCoordinates({
        latitudeFrom: 0,
        longitudeTo: 0,
      }).length,
    ).toBeGreaterThan(0);

    expect(
      locationTimezone.findLocationsByCoordinates({
        latitudeTo: 0,
        longitudeFrom: 0,
      }).length,
    ).toBeGreaterThan(0);

    expect(
      locationTimezone.findLocationsByCoordinates({
        latitudeTo: 0,
        longitudeTo: 0,
      }).length,
    ).toBeGreaterThan(0);
  });

  it('should return correct locations within the provided coordinates range', () => {
    const locations1 = locationTimezone.findLocationsByCoordinates({
      latitudeFrom: 0,
      longitudeFrom: 0,
    });

    expect(locations1.length).toBeGreaterThan(0);

    locations1.forEach((location) => {
      expect(location.latitude).toBeGreaterThanOrEqual(0);
      expect(location.longitude).toBeGreaterThanOrEqual(0);
    });

    const locations2 = locationTimezone.findLocationsByCoordinates({
      latitudeFrom: -55,
      latitudeTo: 1,
      longitudeFrom: -8,
      longitudeTo: 5,
    });

    expect(locations2.length).toBeGreaterThan(0);

    locations2.forEach((location) => {
      expect(location.latitude).toBeGreaterThanOrEqual(-55);
      expect(location.latitude).toBeLessThanOrEqual(1);
      expect(location.longitude).toBeGreaterThanOrEqual(-8);
      expect(location.longitude).toBeLessThanOrEqual(5);
    });
  });
});

describe('findLocationsByCountryIso', () => {
  it('should return the empty array when no values are provided', () => {
    expect(locationTimezone.findLocationsByCountryIso('')).toEqual([]);
  });

  it('should return locations from iso2', () => {
    const locations = locationTimezone.findLocationsByCountryIso('JP');
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
    locations.forEach((location) => {
      expect(location.country.iso2).toEqual('JP');
    });
  });

  it('should return locations from iso3', () => {
    const locations = locationTimezone.findLocationsByCountryIso('JPN');
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
    locations.forEach((location) => {
      expect(location.country.iso3).toEqual('JPN');
    });
  });

  it('should ignore case', () => {
    const locations1 = locationTimezone.findLocationsByCountryIso('jp');
    const locations2 = locationTimezone.findLocationsByCountryIso('jpN');
    expect(locations1).not.toBeUndefined();
    expect(locations1).toEqual(expect.any(Array));
    expect(locations1.length).toBeGreaterThan(0);
    expect(locations2).not.toBeUndefined();
    expect(locations2).toEqual(expect.any(Array));
    expect(locations2.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations1).error).toBeUndefined();
    expect(Joi.array().items(locationSchema).required().validate(locations2).error).toBeUndefined();
    expect(locations1.length).toEqual(locations2.length);
  });
});

describe('findLocationsByCountryName', () => {
  it('should return the empty array when no values are provided', () => {
    expect(locationTimezone.findLocationsByCountryName('')).toEqual([]);
  });

  it('should return locations with short name', () => {
    const locations = locationTimezone.findLocationsByCountryName('Timor-Leste');
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
    locations.forEach((location) => {
      expect(location.country.iso2).toEqual('TL');
    });
  });

  it('should return locations with official name', () => {
    const locations = locationTimezone.findLocationsByCountryName(
      'The Democratic Republic of Timor-Leste',
    );
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
    locations.forEach((location) => {
      expect(location.country.iso2).toEqual('TL');
    });
  });

  it('should ignore case', () => {
    const locations1 = locationTimezone.findLocationsByCountryName('timor-leste');
    const locations2 = locationTimezone.findLocationsByCountryName(
      'the Democratic Republic of Timor-Leste',
    );
    expect(locations1).not.toBeUndefined();
    expect(locations1).toEqual(expect.any(Array));
    expect(locations1.length).toBeGreaterThan(0);
    expect(locations2).not.toBeUndefined();
    expect(locations2).toEqual(expect.any(Array));
    expect(locations2.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations1).error).toBeUndefined();
    expect(Joi.array().items(locationSchema).required().validate(locations2).error).toBeUndefined();
    expect(locations1.length).toEqual(locations2.length);
    locations1.forEach((location) => {
      expect(location.country.iso2).toEqual('TL');
    });
    locations2.forEach((location) => {
      expect(location.country.iso2).toEqual('TL');
    });
  });

  it('should return all locations with a partial match', () => {
    const locations = locationTimezone.findLocationsByCountryName('timor', true);
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
    locations.forEach((location) => {
      expect(location.country.iso2).toEqual('TL');
    });
  });

  it('should not return all locations if partial match is set to false', () => {
    const locations = locationTimezone.findLocationsByCountryName('timor', false);
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toEqual(0);
  });
});

describe('findLocationsByProvince', () => {
  it('should not return the empty array when the empty string is provided', () => {
    expect(locationTimezone.findLocationsByProvince('').length).toBeGreaterThan(0);
  });

  it('should return locations in the province', () => {
    const locations = locationTimezone.findLocationsByProvince('Tristan da Cunha');
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
    locations.forEach((location) => {
      expect(location.province).toEqual('Tristan da Cunha');
    });
  });

  it('should ignore case', () => {
    const locations1 = locationTimezone.findLocationsByProvince('Damascus');
    const locations2 = locationTimezone.findLocationsByProvince('damascuS');
    expect(locations1).not.toBeUndefined();
    expect(locations1).toEqual(expect.any(Array));
    expect(locations1.length).toBeGreaterThan(0);
    expect(locations2).not.toBeUndefined();
    expect(locations2).toEqual(expect.any(Array));
    expect(locations2.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations1).error).toBeUndefined();
    expect(Joi.array().items(locationSchema).required().validate(locations2).error).toBeUndefined();
    expect(locations1.length).toEqual(locations2.length);
    locations1.forEach((location) => {
      expect(location.province).toEqual('Damascus');
    });
    locations2.forEach((location) => {
      expect(location.province).toEqual('Damascus');
    });
  });

  it('should return all locations with a partial match', () => {
    const locations = locationTimezone.findLocationsByProvince('tokel', true);
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
    locations.forEach((location) => {
      expect(location.province).toEqual('Tokelau');
    });
  });

  it('should not return all locations if partial match is set to false', () => {
    const locations = locationTimezone.findLocationsByProvince('tokel', false);
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toEqual(0);
  });
});

describe('findLocationsByState', () => {
  it('should not return the empty array when the empty string is provided', () => {
    expect(locationTimezone.findLocationsByState('').length).toBeGreaterThan(0);
  });

  it('should return locations in the state', () => {
    const locations = locationTimezone.findLocationsByState('NY');
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
    locations.forEach((location) => {
      expect(location.state).toEqual('NY');
    });
  });

  it('should ignore case', () => {
    const locations1 = locationTimezone.findLocationsByState('ny');
    const locations2 = locationTimezone.findLocationsByState('Ny');
    expect(locations1).not.toBeUndefined();
    expect(locations1).toEqual(expect.any(Array));
    expect(locations1.length).toBeGreaterThan(0);
    expect(locations2).not.toBeUndefined();
    expect(locations2).toEqual(expect.any(Array));
    expect(locations2.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations1).error).toBeUndefined();
    expect(Joi.array().items(locationSchema).required().validate(locations2).error).toBeUndefined();
    expect(locations1.length).toEqual(locations2.length);
    locations1.forEach((location) => {
      expect(location.state).toEqual('NY');
    });
    locations2.forEach((location) => {
      expect(location.state).toEqual('NY');
    });
  });

  it('should return all locations with a partial match', () => {
    const locations = locationTimezone.findLocationsByState('x', true);
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toBeGreaterThan(0);
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
    locations.forEach((location) => {
      expect(location.state).toEqual('TX');
    });
  });

  it('should not return all locations if partial match is set to false', () => {
    const locations = locationTimezone.findLocationsByState('x', false);
    expect(locations).not.toBeUndefined();
    expect(locations).toEqual(expect.any(Array));
    expect(locations.length).toEqual(0);
  });
});

describe('getLocations', () => {
  it('should return all the locations', () => {
    const locations = locationTimezone.getLocations();
    expect(locations).not.toBeUndefined();
    expect(Joi.array().items(locationSchema).required().validate(locations).error).toBeUndefined();
  });
});
