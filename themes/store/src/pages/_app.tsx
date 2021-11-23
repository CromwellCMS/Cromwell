import {
    ECommonComponentNames,
    getStoreItem,
    isServer,
    saveCommonComponent,
    setStoreItem,
    TCromwellPage,
    TPageCmsProps,
} from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import * as React from 'react';
import { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import { PostCard } from '../components/postCard/PostCard';
import { ProductCard } from '../components/productCard/ProductCard';
import { toast } from '../components/toast/toast';
import { createEmotionCache } from '../helpers/createEmotionCache';
import { getTheme } from '../helpers/theme';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

if (isServer()) {
    // disable ssr useLayoutEffect warnings
    (React as any).useLayoutEffect = React.useEffect;
}

saveCommonComponent(ECommonComponentNames.ProductCard, ProductCard);
saveCommonComponent(ECommonComponentNames.PostCard, PostCard);

export type TPageWithLayout<TProps = any> = TCromwellPage<TProps> & {
    getLayout?: (page: ReactElement) => JSX.Element;
}

type AppPropsWithLayout = AppProps & {
    Component: TPageWithLayout & { originalPage?: TPageWithLayout };
    emotionCache?: EmotionCache;
}

function App(props: AppPropsWithLayout) {

    const getUser = async () => {
        const userInfo = getStoreItem('userInfo');
        if (!userInfo) {
            try {
                const user = await getRestApiClient()?.getUserInfo({ disableLog: true });
                if (user) {
                    setStoreItem('userInfo', user);
                }
            } catch (e) { }
        }
    }

    React.useEffect(() => {
        if (!isServer()) {
            getRestApiClient()?.onError((info) => {
                if (info.statusCode === 429) {
                    toast.error('Too many requests. Try again later');
                }
            }, '_app');

            getUser();
        }
    }, []);

    const { Component, emotionCache = clientSideEmotionCache } = props;
    const getLayout = Component.getLayout ?? Component.originalPage?.getLayout ?? ((page) => page);

    const cmsProps: TPageCmsProps | undefined = props.pageProps?.cmsProps;
    const theme = getTheme(cmsProps?.palette);

    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                {getLayout(<>
                    {Component && <Component {...(props.pageProps ?? {})} />}
                    {!isServer() && document?.body && ReactDOM.createPortal(
                        <div className={"global-toast"} ><ToastContainer /></div>, document.body)}
                </>)}
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;