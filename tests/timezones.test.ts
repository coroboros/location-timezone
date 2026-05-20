import Joi from 'joi';
import { describe, expect, it } from 'vitest';
import locationTimezone from '../src/index.js';

describe('findTimezoneByCapitalOfCountryIso', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findTimezoneByCapitalOfCountryIso('')).toBeUndefined();
  });

  it('should return a timezone from iso2', () => {
    const timezone = locationTimezone.findTimezoneByCapitalOfCountryIso('JP');
    expect(timezone).not.toBeUndefined();
    expect(timezone).toBe('Asia/Tokyo');
  });

  it('should return a timezone from iso3', () => {
    const timezone = locationTimezone.findTimezoneByCapitalOfCountryIso('KAZ');
    expect(timezone).not.toBeUndefined();
    expect(timezone).toBe('Asia/Almaty');
  });

  it('should ignore case', () => {
    const timezone1 = locationTimezone.findTimezoneByCapitalOfCountryIso('jp');
    const timezone2 = locationTimezone.findTimezoneByCapitalOfCountryIso('kAz');
    expect(timezone1).not.toBeUndefined();
    expect(timezone1).toBe('Asia/Tokyo');
    expect(timezone2).not.toBeUndefined();
    expect(timezone2).toBe('Asia/Almaty');
  });

  it('should return a timezone if the country does not have a capital', () => {
    const timezone = locationTimezone.findTimezoneByCapitalOfCountryIso('BVT');
    expect(timezone).not.toBeUndefined();
    expect(timezone).toBe('Europe/Oslo');
  });
});

describe('findTimezoneByCapitalOfCountryName', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findTimezoneByCapitalOfCountryName('')).toBeUndefined();
  });

  it('should return a timezone with short name', () => {
    const timezone = locationTimezone.findTimezoneByCapitalOfCountryName(
      'British Indian Ocean Territory',
    );
    expect(timezone).not.toBeUndefined();
    expect(timezone).toBe('Indian/Chagos');
  });

  it('should return a timezone with official name', () => {
    const timezone = locationTimezone.findTimezoneByCapitalOfCountryName(
      'The British Indian Ocean Territory',
    );
    expect(timezone).not.toBeUndefined();
    expect(timezone).toBe('Indian/Chagos');
  });

  it('should ignore case', () => {
    const timezone1 = locationTimezone.findTimezoneByCapitalOfCountryName(
      'thE british Indian Ocean territory',
    );
    const timezone2 = locationTimezone.findTimezoneByCapitalOfCountryName(
      'british indian ocean territory',
    );
    expect(timezone1).not.toBeUndefined();
    expect(timezone1).toBe('Indian/Chagos');
    expect(timezone2).not.toBeUndefined();
    expect(timezone2).toBe('Indian/Chagos');
  });
});

describe('findTimezoneByCityName', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findTimezoneByCityName('')).toBeUndefined();
  });

  it('should return a timezone', () => {
    const timezone = locationTimezone.findTimezoneByCityName('Diego Garcia');
    expect(timezone).not.toBeUndefined();
    expect(timezone).toBe('Indian/Chagos');
  });

  it('should ignore case', () => {
    const timezone1 = locationTimezone.findTimezoneByCityName('Diego Garcia');
    const timezone2 = locationTimezone.findTimezoneByCityName('diego garcia');
    expect(timezone1).not.toBeUndefined();
    expect(timezone1).toBe('Indian/Chagos');
    expect(timezone2).not.toBeUndefined();
    expect(timezone2).toBe('Indian/Chagos');
  });
});

describe('findTimezonesByCountryIso', () => {
  it('should return the empty array when no values are provided', () => {
    expect(locationTimezone.findTimezonesByCountryIso('')).toEqual([]);
  });

  it('should return timezones from iso2', () => {
    const timezones = locationTimezone.findTimezonesByCountryIso('BF');
    expect(timezones).not.toBeUndefined();
    expect(timezones).toEqual(['Africa/Ouagadougou']);
  });

  it('should return timezones from iso3', () => {
    const timezones = locationTimezone.findTimezonesByCountryIso('CAN');
    expect(timezones).not.toBeUndefined();
    expect(timezones).toEqual([
      'America/Blanc-Sablon',
      'America/Cambridge_Bay',
      'America/Coral_Harbour',
      'America/Creston',
      'America/Dawson',
      'America/Dawson_Creek',
      'America/Detroit',
      'America/Edmonton',
      'America/Fort_Nelson',
      'America/Glace_Bay',
      'America/Goose_Bay',
      'America/Halifax',
      'America/Inuvik',
      'America/Iqaluit',
      'America/Moncton',
      'America/Nipigon',
      'America/Panama',
      'America/Pangnirtung',
      'America/Rankin_Inlet',
      'America/Regina',
      'America/Resolute',
      'America/St_Johns',
      'America/Thunder_Bay',
      'America/Toronto',
      'America/Vancouver',
      'America/Whitehorse',
      'America/Winnipeg',
      'America/Yellowknife',
    ]);
  });

  it('should ignore case', () => {
    const timezones1 = locationTimezone.findTimezonesByCountryIso('cL');
    const timezones2 = locationTimezone.findTimezonesByCountryIso('ChL');
    expect(timezones1).not.toBeUndefined();
    expect(timezones1).toEqual(['America/Santiago']);
    expect(timezones2).not.toBeUndefined();
    expect(timezones2).toEqual(['America/Santiago']);
  });
});

describe('findTimezonesByCountryName', () => {
  it('should return the empty array when no values are provided', () => {
    expect(locationTimezone.findTimezonesByCountryName('')).toEqual([]);
  });

  it('should return timezones with short name', () => {
    const timezones = locationTimezone.findTimezonesByCountryName('Cocos (Keeling) Islands');
    expect(timezones).not.toBeUndefined();
    expect(timezones).toEqual(['Indian/Cocos']);
  });

  it('should return timezones with official name', () => {
    const timezones = locationTimezone.findTimezonesByCountryName(
      'The Territory of Cocos (Keeling) Islands',
    );
    expect(timezones).not.toBeUndefined();
    expect(timezones).toEqual(['Indian/Cocos']);
  });

  it('should ignore case', () => {
    const timezones1 = locationTimezone.findTimezonesByCountryName(
      'Democratic Republic of the Congo',
    );
    const timezones2 = locationTimezone.findTimezonesByCountryName(
      'The Democratic Republic of the Congo',
    );
    expect(timezones1).not.toBeUndefined();
    expect(timezones1).toEqual(['Africa/Kinshasa', 'Africa/Lubumbashi']);
    expect(timezones2).not.toBeUndefined();
    expect(timezones2).toEqual(['Africa/Kinshasa', 'Africa/Lubumbashi']);
  });
});

describe('getTimezones', () => {
  it('should return all the timezones', () => {
    const timezones = locationTimezone.getTimezones();
    expect(timezones).not.toBeUndefined();
    expect(
      Joi.array().items(Joi.string().min(2).required()).required().validate(timezones).error,
    ).toBeUndefined();
  });
});
