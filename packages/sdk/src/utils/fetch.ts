export const fetchAcross = globalThis.fetch.bind(globalThis);
// enforce usage of Node v18+ if this sdk is to be used in Node

//  @todo unify error handling

/**
 * Builds a URL search string from an object of query parameters.
 *
 * @param params - An object where keys are query parameter names and values are either a string or an array of strings representing the parameter values.
 *
 * @returns queryString - A properly formatted query string for use in URLs, (without the leading '?').
 */

export function buildSearchParams(
  params: Record<string, number | bigint | string | Array<number | string>>,
): string {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach((val) => searchParams.append(key, String(val)));
    } else {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}
