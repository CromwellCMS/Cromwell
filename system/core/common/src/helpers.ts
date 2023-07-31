import { getStoreItem } from './global-store';
import { TDefaultPageName } from './types/data';

export const isServer = (): boolean => typeof window === 'undefined';

// 24 length max
export const getRandStr = (length: number = 12) =>
  Math.random()
    .toString(36)
    .substring(2, Math.floor(length / 2) + 2) +
  Math.random()
    .toString(36)
    .substring(2, Math.ceil(length / 2) + 2);

export const sleep = (time: number) => new Promise((done) => setTimeout(done, time * 1000));

/**
 * Resolves page name to target page route
 * @param pageName - Can be:
 * 1. TDefaultPageName (eg. `product`),
 * 2. Resolved default page name (eg. `product/[slug]`),
 * 3. Target page name (eg. `product/my-product`)
 * @param routeOptions - Options for resolving page route
 * - `slug` - Page slug (URL) to resolve inputs in form of: `product/[slug]`
 */
export const resolvePageRoute = (
  pageName: string | TDefaultPageName,
  routeOptions?: {
    slug?: string | number;
    id?: string;
  },
) => {
  let pageRoute: string = pageName;
  const { slug, id } = routeOptions ?? {};

  if (slug || id) {
    // 1. TDefaultPageName -> Resolved default page
    const defaultPages = getStoreItem('defaultPages');
    if (defaultPages?.[pageName]) {
      pageRoute = defaultPages?.[pageName];
    }

    // 2. Resolved default page -> Target page name
    if (slug) pageRoute = pageRoute.replace('[slug]', String(slug));
    if (id) pageRoute = pageRoute.replace('[id]', id);
  }

  // 3. Custom modifications
  if (pageRoute === 'index') pageRoute = '/';
  if (!pageRoute.startsWith('/')) pageRoute = '/' + pageRoute;

  return pageRoute;
};

/** @internal */
export const removeUndefined = <T>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'undefined') delete obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) removeUndefined(val);
  }
  return obj;
};

/** @internal */
export const removeUndefinedOrNull = <T>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'undefined') delete obj[key];
    if (val === null) delete obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) removeUndefined(val);
  }
  return obj;
};

/** @internal */
export const removeEmpty = <T>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;

  const processArray = (arr: any[]) => {
    return arr
      .map((it) => {
        if (typeof it === 'object' && Array.isArray(it)) {
          return processArray(it);
        }
        return it;
      })
      .filter((it) => {
        if (typeof it === 'undefined') return false;
        if (it === null) return false;
        if (typeof it === 'number' && isNaN(it)) return false;
        if (typeof it === 'object') {
          if (!Array.isArray(it)) {
            removeEmpty(it);
            if (Object.keys(it).length === 0) return false;
          } else {
            if (it.length === 0) return false;
          }
        }
        return true;
      });
  };

  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'undefined') delete obj[key];
    if (val === null) delete obj[key];
    if (typeof val === 'number' && isNaN(val)) delete obj[key];

    if (val !== null && typeof val === 'object') {
      if (Array.isArray(val)) {
        obj[key] = processArray(val);
        if (obj[key].length === 0) delete obj[key];
      } else {
        removeUndefined(val);
      }
    }
  }
  return obj;
};

export const awaitValue = async <T>(
  valueGetter: () => T | Promise<T | undefined | null> | undefined | null,
  timeout: number,
  { interval = 0.1, logger = console }: { interval?: number; logger?: Partial<typeof console> } = {},
): Promise<T | undefined | null> => {
  return new Promise<T | undefined | null>((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timeout * 1000);

    (async () => {
      const value = await valueGetter();
      if (value) {
        resolve(value);
        return;
      }

      for (let i = 0; i < timeout / interval; i++) {
        await sleep(interval);
        const value = await valueGetter();
        if (value) {
          resolve(value);
          return;
        }
      }

      resolve(null);
    })().catch((error) => logger?.error?.(error));
  });
};
