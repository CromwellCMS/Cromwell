import { getStoreItem } from './global-store';
import { TCmsRedirectObject } from './types/entities';

export const findRedirect = (pathname: string, search?: string | null): TCmsRedirectObject & {
    type: 'redirect' | 'rewrite';
} | undefined => {

    const redirects = [
        ...(getStoreItem('cmsSettings')?.redirects ?? []),
        ...Object.values(getStoreItem('redirects') ?? {}),
    ];
    const rewrites = [
        ...(getStoreItem('cmsSettings')?.rewrites ?? []),
        ...Object.values(getStoreItem('rewrites') ?? {}),
    ];

    const inferredRedirects = redirects.map(redirect => {
        if (typeof redirect === 'function') {
            const inferred = redirect(pathname, search);
            if (!inferred) return;
            return {
                from: pathname,
                ...inferred,
            }
        }
        return redirect;
    });

    const inferredRewrites = rewrites.map(rewrite => {
        if (typeof rewrite === 'function') {
            const inferred = rewrite(pathname, search);
            if (!inferred) return;
            return {
                to: pathname,
                ...inferred,
            }
        }
        return rewrite;
    });

    const finalRedirect = inferredRedirects.find(redirect => {
        if (redirect?.from === pathname) return redirect;
    });
    if (finalRedirect?.to) return {
        type: 'redirect',
        ...finalRedirect,
    }

    const finalRewrite = inferredRewrites.find(rewrite => {
        if (rewrite?.to === pathname) return rewrite;
    });
    if (finalRewrite?.from) return {
        type: 'rewrite',
        ...finalRewrite,
    }
}
