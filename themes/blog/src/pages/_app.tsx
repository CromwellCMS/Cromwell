import { isServer, TCromwellPage, TPageCmsProps } from '@cromwell/core';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import React from 'react';
import { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import { createEmotionCache } from '../helpers/createEmotionCache';
import { getTheme } from '../helpers/theme';

export type TPageWithLayout<TProps = any> = TCromwellPage<TProps> & {
    getLayout?: (page: ReactElement) => JSX.Element;
}

const clientSideEmotionCache = createEmotionCache();

type AppPropsWithLayout = AppProps & {
    Component: TPageWithLayout;
    emotionCache?: EmotionCache;
}

function App(props: AppPropsWithLayout) {
    const { Component, emotionCache = clientSideEmotionCache } = props;
    const getLayout = Component.getLayout ?? ((page) => page);
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