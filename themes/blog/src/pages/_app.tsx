import { isServer, TCromwellPage } from '@cromwell/core';
import { AppProps } from 'next/app';
import React from 'react';
import { ReactElement, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

export type TPageWithLayout<TProps = any> = TCromwellPage<TProps> & {
    getLayout?: (page: ReactElement) => ReactNode;
}

type AppPropsWithLayout = AppProps & {
    Component: TPageWithLayout;
}

function App(props: AppPropsWithLayout) {
    React.useEffect(() => {
        // const jssStyles = document.querySelector('#jss-server-side');
        // jssStyles?.parentElement?.removeChild(jssStyles);
    }, []);

    const Component = props.Component;
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(<>
        {Component && <Component {...(props.pageProps ?? {})} />}
        {!isServer() && document?.body && ReactDOM.createPortal(
            <div className={"global-toast"} ><ToastContainer /></div>, document.body)}
    </>);
}

export default App;