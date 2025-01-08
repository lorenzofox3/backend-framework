export const mapValues = (obj, mapFn) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, mapFn(value, key), value]),
  );
