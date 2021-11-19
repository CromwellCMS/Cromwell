import '@cromwell/core-frontend/dist/_index.css';
import '@cromwell/renderer/build/editor-styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';

import { isServer, TCromwellPage, TPageCmsProps } from '@cromwell/core';
import { withCromwellApp } from '@cromwell/renderer';
import { ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import React from 'react';
import { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import { getTheme } from '../helpers/theme';

export type TPageWithLayout<TProps = any> = TCromwellPage<TProps> & {
    getLayout?: (page: ReactElement) => JSX.Element;
}

type AppPropsWithLayout = AppProps & {
    Component: TCromwellPage & { originalPage: TPageWithLayout };
}

function App(props: AppPropsWithLayout) {
    React.useEffect(() => {
        // const jssStyles = document.querySelector('#jss-server-side');
        // jssStyles?.parentElement?.removeChild(jssStyles);
    }, []);

    const Component = props.Component;
    const getLayout = Component.originalPage.getLayout ?? ((page) => page);
    const cmsProps: TPageCmsProps | undefined = props.pageProps?.cmsProps;
    const theme = getTheme(cmsProps?.palette);

    return getLayout(<>
        <ThemeProvider theme={theme}>
            {Component && <Component {...(props.pageProps ?? {})} />}
            {!isServer() && document?.body && ReactDOM.createPortal(
                <div className={"global-toast"} ><ToastContainer /></div>, document.body)}
        </ThemeProvider>
    </>);
}

export default withCromwellApp(App);