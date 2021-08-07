import { getStore, getStoreItem, isServer, TCmsRedirectObject } from '@cromwell/core';
import SingletonRouter, { Router, useRouter } from 'next/router';
import { useLayoutEffect } from 'react';

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


export const usePatchForRedirects = () => {
    // Patch next/router for rewrites
    const router = useRouter?.();
    const canLogDebugInfo = false;
    const logInfo = (...args) => canLogDebugInfo && console.log(...args);

    if (router && !(router as any).cromwellPatch) {
        (router as any).cromwellPatch = true;

        const handleChange = (url, as, options): [url: any, as?: any, options?: any] => {
            logInfo('router.push', url, as, options);
            if (typeof url === 'string') {
                const redirect = findRedirect(url);
                if (redirect?.type === 'rewrite' && redirect.from) {
                    logInfo('router.push rewrite', redirect);
                    (options as any).rewriteTo = url;
                    (options as any).rewriteFrom = redirect.from;

                    if (as && as === url) as = redirect.from;
                    url = redirect.from;
                }
            }
            return [url, as, options];
        }

        const routerPush = router.push;
        router.push = (url, as, options) => {
            return routerPush(...handleChange(url, as, options));
        }

        const routerReplace = router.replace;
        router.replace = (url, as, options) => {
            return routerReplace(...handleChange(url, as, options));
        }

        if (SingletonRouter?.router) {
            (SingletonRouter.router as any).change = (changeType, url, as, options) => {
                logInfo('SingletonRouter args', changeType, url, as, options);
                const { rewriteFrom, rewriteTo, rewrote, ...normalOptions } = options ?? {};

                if (!rewrote) {
                    const nextUrl = rewriteTo ?? as ?? url;
                    const redirect = findRedirect(nextUrl);

                    if (redirect?.type === 'rewrite' && redirect.from) {
                        logInfo('SingletonRouter rewrite', rewriteFrom, rewriteTo);
                        normalOptions.rewriteTo = nextUrl;
                        normalOptions.rewrote = true;

                        if (changeType === 'pushState') {
                            routerPush(redirect.from, undefined, normalOptions);
                        } else {
                            routerReplace(redirect.from, undefined, normalOptions);
                        }

                        return new Promise((resolve) => resolve(false));
                    }
                }
                return (Router.prototype as any).change.apply(SingletonRouter.router, [changeType, url, as, options]);
            }
        }
    }

    if (!isServer()) {
        (window as any).routerPush = (...args) => router.push(args[0], args[1], args[2]);
        (window as any).nextRouter = getStore().nodeModules?.modules?.['next/router'];
    }


    // Patch window.history to handle rewrites
    if (!isServer() && !(window as any).cromwellHistoryPatch) {
        (window as any).cromwellHistoryPatch = true;

        const handleChange = (data: any, title: string, url?: string | null | undefined):
            [data: any, title: string, url?: string | null | undefined] => {
            const rewriteTo = data?.options?.rewriteTo;
            if (rewriteTo) {
                logInfo('history.pushState/replaceState rewrite', rewriteTo);
                if (data?.as && data.as === url) data.as = rewriteTo;
                if (data?.url && data.url === url) data.url = rewriteTo;
                url = rewriteTo;
            }
            return [data, title, url];
        }

        const pushState = history.pushState;
        history.pushState = (...params) => {
            logInfo('history.pushState params', params)
            pushState.apply(history, handleChange(...params));
        };

        const replaceState = history.replaceState;
        history.replaceState = (...params) => {
            logInfo('history.replaceState params', params)
            replaceState.apply(history, handleChange(...params));
        };
    }

    // Handle redirects
    if (!isServer()) {
        useLayoutEffect(() => {
            const redirect = findRedirect(window.location.pathname, window.location.search);
            if (redirect?.type === 'redirect' && redirect.to) {
                logInfo('useLayoutEffect redirect', redirect, router?.route)
                router?.replace(redirect.to);
            }
        });
    }
}