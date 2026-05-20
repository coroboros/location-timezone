import * as countriesNs from './countries.js';
import * as locationsNs from './locations.js';
import * as statesAnsiNs from './states-ansi.js';
import * as timezonesNs from './timezones.js';

export * from './countries.js';
export type { Capital, Country, Location, StateAnsi } from './interfaces.js';
export * from './locations.js';
export * from './states-ansi.js';
export * from './timezones.js';

const locationTimezone = {
  ...countriesNs,
  ...locationsNs,
  ...statesAnsiNs,
  ...timezonesNs,
} as const;

export default locationTimezone;
