import { statesAnsi } from './data/index.js';
import { hasLen, is, match } from './helpers.js';
import type { StateAnsi } from './interfaces.js';

/**
 * @func findStateAnsiByFipsCode Find the state's information based on the
 * Federal Information Processing Standard (FIPS) State Code ANSI
 * (American National Standards Institute, USA states only).
 *
 * @param  {string}  code  FIPS ANSI code (case insensitive, 2 chars)
 * @return {StateAnsi|undefined}
 */
export const findStateAnsiByFipsCode = function findStateAnsiByFipsCode(
  code: string,
): StateAnsi | undefined {
  if (!hasLen({ str: code, from: 2, to: 2 })) {
    return undefined;
  }

  return statesAnsi.find((state) =>
    match({
      source: state.fipsCode,
      compare: code,
      partial: false,
      strict: false,
    }),
  );
};

/**
 * @func findStateAnsiByGnisid Find the state's information based on the
 * Geographic Names Information System Identifier (GNISID) ANSI
 * (American National Standards Institute, USA states only).
 *
 * @param  {string}  id  GNISID ANSI (case insensitive)
 * @return {StateAnsi|undefined}
 */
export const findStateAnsiByGnisid = function findStateAnsiByGnisid(
  id: string,
): StateAnsi | undefined {
  if (!is(String, id)) {
    return undefined;
  }

  return statesAnsi.find((state) =>
    match({
      source: state.gnisid,
      compare: id,
      partial: false,
      strict: false,
    }),
  );
};

/**
 * @func findStateAnsiByName Find the state's information by its name ANSI
 * (American National Standards Institute, USA states only).
 *
 * @param  {string}  name  Name ANSI (case insensitive)
 * @return {StateAnsi|undefined}
 */
export const findStateAnsiByName = function findStateAnsiByName(
  name: string,
): StateAnsi | undefined {
  if (!is(String, name)) {
    return undefined;
  }

  return statesAnsi.find((state) =>
    match({
      source: state.name,
      compare: name,
      partial: false,
      strict: false,
    }),
  );
};

/**
 * @func findStateAnsiByUspsCode Find the state's information based on the
 * Official United States Postal Service (USPS) Code ANSI
 * (American National Standards Institute, USA states only).
 *
 * @param  {string}  code  USPS ANSI code (case insensitive, 2 chars)
 * @return {StateAnsi|undefined}
 */
export const findStateAnsiByUspsCode = function findStateAnsiByUspsCode(
  code: string,
): StateAnsi | undefined {
  if (!hasLen({ str: code, from: 2, to: 2 })) {
    return undefined;
  }

  return statesAnsi.find((state) =>
    match({
      source: state.uspsCode,
      compare: code,
      partial: false,
      strict: false,
    }),
  );
};

/**
 * @func getStatesAnsi Get all states ANSI (American National Standards Institute, USA states only).
 *
 * @return  {StateAnsi[]}
 */
export const getStatesAnsi = function getStatesAnsi(): StateAnsi[] {
  return statesAnsi;
};
