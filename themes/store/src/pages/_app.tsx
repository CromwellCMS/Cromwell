import {
    ECommonComponentNames,
    getStoreItem,
    isServer,
    saveCommonComponent,
    setStoreItem,
    TCromwellPage,
} from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { AppProps } from 'next/app';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import { PostCard } from '../components/postCard/PostCard';
import { ProductCard } from '../components/productCard/ProductCard';
import { toast } from '../components/toast/toast';

import type { ReactElement, ReactNode } from 'react'
if (isServer()) {
    // useLayoutEffect warnings ssr disable
    (React as any).useLayoutEffect = React.useEffect;
}

saveCommonComponent(ECommonComponentNames.ProductCard, ProductCard);
saveCommonComponent(ECommonComponentNames.PostCard, PostCard);

export type TPageWithLayout<TProps = any> = TCromwellPage<TProps> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: TPageWithLayout;
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

    const Component = props.Component;
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(<>
        {Component && <Component {...(props.pageProps ?? {})} />}
        {!isServer() && document?.body && ReactDOM.createPortal(
            <div className={"global-toast"} ><ToastContainer /></div>, document.body)}
    </>);
}

export default App;

