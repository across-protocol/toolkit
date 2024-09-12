/**
 * Builds a URL search string from an object of query parameters.
 *
 * @param params - An object where keys are query parameter names and values are either a string or an array of strings representing the parameter values.
 *
 * @returns queryString - A properly formatted query string for use in URLs, (without the leading '?').
 */

type ParamBaseValue = number | bigint | string | boolean;
export function buildSearchParams(
  params: Record<string, ParamBaseValue | Array<ParamBaseValue>>,
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

export function isOk(res: Response) {
  // accept cached responses
  if ((res.status >= 200 && res.status < 300) || res.status === 304) {
    return true;
  }
  return false;
}
