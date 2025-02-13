export const createQueryString = (query: Record<string, string>) =>
  Object.entries(query)
    .reduce((params, [key, value]) => {
      params.set(key, value);
      return params;
    }, new URLSearchParams())
    .toString();
