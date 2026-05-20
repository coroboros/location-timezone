import {
  stateAnsiByFipsCode,
  stateAnsiByGnisid,
  stateAnsiByLowerName,
  stateAnsiByUspsCode,
  statesAnsi,
} from './data/states-ansi.js';
import { hasLen } from './helpers.js';
import type { StateAnsi } from './interfaces.js';

/**
 * Find a US state by FIPS State Code ANSI. Length-2 strings only.
 */
export const findStateAnsiByFipsCode = (code: string): StateAnsi | undefined => {
  if (!hasLen({ str: code, from: 2, to: 2 })) {
    return undefined;
  }
  return stateAnsiByFipsCode.get(code);
};

/**
 * Find a US state by GNISID (Geographic Names Information System Identifier).
 */
export const findStateAnsiByGnisid = (id: string): StateAnsi | undefined => {
  if (typeof id !== 'string') {
    return undefined;
  }
  return stateAnsiByGnisid.get(id);
};

/**
 * Find a US state by name. Case-insensitive.
 */
export const findStateAnsiByName = (name: string): StateAnsi | undefined => {
  if (typeof name !== 'string') {
    return undefined;
  }
  return stateAnsiByLowerName.get(name.toLowerCase());
};

/**
 * Find a US state by USPS code. Length-2 strings only. Case-insensitive.
 */
export const findStateAnsiByUspsCode = (code: string): StateAnsi | undefined => {
  if (!hasLen({ str: code, from: 2, to: 2 })) {
    return undefined;
  }
  return stateAnsiByUspsCode.get(code.toUpperCase());
};

/**
 * All US states (ANSI), sorted by name ascending.
 */
export const getStatesAnsi = (): StateAnsi[] => statesAnsi;
