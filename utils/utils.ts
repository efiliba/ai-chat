export const createQueryString = (query: Record<string, string>) =>
  Object.entries(query)
    .reduce((params, [key, value]) => {
      params.set(key, value);
      return params;
    }, new URLSearchParams())
    .toString();

export const switchKeys = <T extends { [key: string]: U }, U>(
  object: T,
  key1: string,
  key2: string
) => ({
  ...object,
  [key1]: object[key2],
  [key2]: object[key1],
});
