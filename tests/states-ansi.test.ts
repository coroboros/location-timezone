import Joi from 'joi';
import { describe, expect, it } from 'vitest';
import locationTimezone from '../src/index.js';

const stateAnsiSchema = Joi.object({
  fipsCode: Joi.string().min(2).max(2).required(),
  gnisid: Joi.string().min(8).max(8).required(),
  name: Joi.string().min(2).required(),
  uspsCode: Joi.string().min(2).max(2).required(),
});

describe('findStateAnsiByFipsCode', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findStateAnsiByFipsCode('')).toBeUndefined();
  });

  it('should return a state', () => {
    const state = locationTimezone.findStateAnsiByFipsCode('05');
    expect(state).not.toBeUndefined();
    expect(state?.fipsCode).toEqual('05');
    expect(state?.name).toEqual('Arkansas');
    expect(stateAnsiSchema.validate(state).error).toBeUndefined();
  });
});

describe('findStateAnsiByGnisid', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findStateAnsiByGnisid('')).toBeUndefined();
  });

  it('should return a state', () => {
    const state = locationTimezone.findStateAnsiByGnisid('00068085');
    expect(state).not.toBeUndefined();
    expect(state?.gnisid).toEqual('00068085');
    expect(state?.name).toEqual('Arkansas');
    expect(stateAnsiSchema.validate(state).error).toBeUndefined();
  });
});

describe('findStateAnsiByName', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findStateAnsiByName('')).toBeUndefined();
  });

  it('should return a state', () => {
    const state = locationTimezone.findStateAnsiByName('Arkansas');
    expect(state).not.toBeUndefined();
    expect(state?.gnisid).toEqual('00068085');
    expect(state?.name).toEqual('Arkansas');
    expect(stateAnsiSchema.validate(state).error).toBeUndefined();
  });

  it('should ignore case', () => {
    const state = locationTimezone.findStateAnsiByName('arkansas');
    expect(state).not.toBeUndefined();
    expect(state?.gnisid).toEqual('00068085');
    expect(state?.name).toEqual('Arkansas');
    expect(stateAnsiSchema.validate(state).error).toBeUndefined();
  });
});

describe('findStateAnsiByUspsCode', () => {
  it('should return undefined when no values are provided', () => {
    expect(locationTimezone.findStateAnsiByUspsCode('')).toBeUndefined();
  });

  it('should return a state', () => {
    const state = locationTimezone.findStateAnsiByUspsCode('AR');
    expect(state).not.toBeUndefined();
    expect(state?.uspsCode).toEqual('AR');
    expect(state?.name).toEqual('Arkansas');
    expect(stateAnsiSchema.validate(state).error).toBeUndefined();
  });

  it('should ignore case', () => {
    const state = locationTimezone.findStateAnsiByUspsCode('ar');
    expect(state).not.toBeUndefined();
    expect(state?.uspsCode).toEqual('AR');
    expect(state?.name).toEqual('Arkansas');
    expect(stateAnsiSchema.validate(state).error).toBeUndefined();
  });
});

describe('getStatesAnsi', () => {
  it('should return all the states', () => {
    const states = locationTimezone.getStatesAnsi();
    expect(states).not.toBeUndefined();
    expect(Joi.array().items(stateAnsiSchema).required().validate(states).error).toBeUndefined();
  });
});
