import { describe, expect, it } from 'vitest';
import locationTimezone from '../src/index.js';

describe('locationTimezone', () => {
  it('should not be undefined', () => {
    expect(locationTimezone).not.toBeUndefined();
  });

  it('should have an expected amount of utility functions', () => {
    const fns = Object.values(locationTimezone);
    expect(fns.length).toEqual(29);
    fns.forEach((fn) => {
      expect(fn).toEqual(expect.any(Function));
    });
  });
});
