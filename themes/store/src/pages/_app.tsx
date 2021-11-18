import {
    ECommonComponentNames,
    getStoreItem,
    isServer,
    saveCommonComponent,
    setStoreItem,
    TCromwellPage,
    TCromwellPageCoreProps,
} from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { AppProps } from 'next/app';
import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import { PostCard } from '../components/postCard/PostCard';
import { ProductCard } from '../components/productCard/ProductCard';
import { toast } from '../components/toast/toast';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { createEmotionCache } from '../helpers/createEmotionCache';
import { getTheme } from '../helpers/theme';
import { ThemeProvider } from '@mui/material/styles';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

if (isServer()) {
    // disable ssr useLayoutEffect warnings
    (React as any).useLayoutEffect = React.useEffect;
}

saveCommonComponent(ECommonComponentNames.ProductCard, ProductCard);
saveCommonComponent(ECommonComponentNames.PostCard, PostCard);

export type TPageWithLayout<TProps = any> = TCromwellPage<TProps> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: TPageWithLayout;
    emotionCache?: EmotionCache;
}

function App(props: AppPropsWithLayout) {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        // const jssStyles = document.querySelector('#jss-server-side');
        // jssStyles?.parentElement?.removeChild(jssStyles);

        if (!isServer()) {
            getRestApiClient()?.onError((info) => {
                if (info.statusCode === 429) {
                    toast.error('Too many requests. Try again later');
                }
            }, '_app');

            getUser();
        }
    }, []);

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

    const { Component, emotionCache = clientSideEmotionCache } = props;
    const pageProps: TCromwellPageCoreProps | undefined = props.pageProps;

    const getLayout = Component.getLayout ?? ((page) => page);
    const theme = getTheme(pageProps?.palette);
    console.log('pageProps?.palette', pageProps?.palette)

    return getLayout(
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                {Component && <Component {...(props.pageProps ?? {})} />}
                {!isServer() && document?.body && ReactDOM.createPortal(
                    <div className={"global-toast"} ><ToastContainer /></div>, document.body)}
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;

