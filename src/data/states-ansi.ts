import { parse } from 'zipson';
import type { StateAnsi } from '../interfaces.js';
import statesAnsiJson from './states-ansi.json' with { type: 'json' };

export const statesAnsi = parse(statesAnsiJson.data) as StateAnsi[];
Object.freeze(statesAnsi);

export const stateAnsiByFipsCode = new Map<string, StateAnsi>();
export const stateAnsiByGnisid = new Map<string, StateAnsi>();
export const stateAnsiByLowerName = new Map<string, StateAnsi>();
export const stateAnsiByUspsCode = new Map<string, StateAnsi>();

for (const state of statesAnsi) {
  stateAnsiByFipsCode.set(state.fipsCode, state);
  stateAnsiByGnisid.set(state.gnisid, state);
  if (state.name) {
    stateAnsiByLowerName.set(state.name.toLowerCase(), state);
  }
  stateAnsiByUspsCode.set(state.uspsCode, state);
}
