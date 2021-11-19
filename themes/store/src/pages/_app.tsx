import '@cromwell/core-frontend/dist/_index.css';
import '@cromwell/renderer/build/editor-styles.css';
import 'pure-react-carousel/dist/react-carousel.es.css';
import 'react-image-lightbox/style.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';

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
import { withCromwellApp } from '@cromwell/renderer';

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
    Component: TCromwellPage & { originalPage: TPageWithLayout };
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
    const getLayout = Component.originalPage.getLayout ?? ((page) => page);

    const cmsProps: TPageCmsProps | undefined = props.pageProps?.cmsProps;
    const theme = getTheme(cmsProps?.palette);

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

export default withCromwellApp(App);