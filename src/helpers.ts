export function exists<T>(thing: T): thing is NonNullable<T> {
  return !(
    thing === undefined ||
    thing === null ||
    (typeof thing === 'number' && Number.isNaN(thing))
  );
}

export function is(Type: typeof String, thing: unknown): thing is string;
export function is(Type: typeof Number, thing: unknown): thing is number;
export function is(Type: typeof Boolean, thing: unknown): thing is boolean;
export function is<T>(Type: new (...args: never[]) => T, thing: unknown): thing is T;
export function is(Type: unknown, thing: unknown): boolean {
  if (!exists(Type) || !exists(thing)) {
    return false;
  }

  if ((thing as { constructor?: unknown }).constructor === Type) {
    return true;
  }

  return typeof Type === 'function' && thing instanceof (Type as new (...args: never[]) => unknown);
}

export function hasLen({ str, from, to }: { str: string; from: number; to: number }): boolean {
  if (!is(String, str)) {
    return false;
  }

  const fromValue = from >= 1 ? from : 1;
  const toValue = to >= 1 && to >= fromValue ? to : fromValue;

  if (fromValue === toValue) {
    return str.charAt(fromValue - 1) !== '';
  }

  return str.charAt(fromValue - 1) !== '' || str.charAt(toValue - 1) !== '';
}

export function match({
  source,
  compare,
  partial = false,
  strict = false,
}: {
  source: string;
  compare: string;
  partial?: boolean;
  strict?: boolean;
}): boolean {
  if (!is(String, source) || !is(String, compare)) {
    return false;
  }

  if (partial === true) {
    return source.toLowerCase().includes(compare.toLowerCase());
  }

  if (strict === true) {
    return source === compare;
  }

  return source.toLowerCase() === compare.toLowerCase();
}
