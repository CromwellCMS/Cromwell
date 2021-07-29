import { getStoreItem } from './global-store';
import { TDefaultPageName } from './types/data';

export const isServer = (): boolean => (typeof window === 'undefined');

export const getRandStr = (lenght: number = 12) =>
    Math.random().toString(36).substring(2, Math.floor(lenght / 2) + 2) +
    Math.random().toString(36).substring(2, Math.ceil(lenght / 2) + 2);

export const sleep = (time: number) => new Promise(done => setTimeout(done, time * 1000));


/**
 * Resolves page name to target page route
 * @param pageName - Can be:
 * 1. TDefaultPageName (eg. `product`), 
 * 2. Resolved default page name (eg. `product/[slug]`),
 * 3. Target page name (eg. `product/my-product`)
 * @param routeOptions - Options for resolving page route
 * - `slug` - Page slug (URL) to resolve inputs in form of: `product/[slug]`
 */
export const resolvePageRoute = (pageName: string | TDefaultPageName, routeOptions?: {
    slug?: string;
    id?: string;
}) => {
    let pageRoute: string = pageName;
    const { slug, id } = routeOptions ?? {};

    if (slug || id) {
        // 1. TDefaultPageName -> Resolved default page
        const defaultPages = getStoreItem('defaultPages');
        if (defaultPages?.[pageName]) {
            pageRoute = defaultPages?.[pageName];
        }

        // 2. Resolved default page -> Target page name
        if (slug) pageRoute = pageRoute.replace('[slug]', slug);
        if (id) pageRoute = pageRoute.replace('[id]', id);
    }

    // 3. Custom modifications
    if (pageRoute === 'index') pageRoute = '/';
    if (!pageRoute.startsWith('/')) pageRoute = '/' + pageRoute;

    return pageRoute;
}


