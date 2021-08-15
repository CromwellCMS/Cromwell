import { ECommonComponentNames, getStoreItem, isServer, saveCommonComponent, setStoreItem } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { AppProps } from 'next/app';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import { PostCard } from '../components/postCard/PostCard';
import { ProductCard } from '../components/productCard/ProductCard';
import { toast } from '../components/toast/toast';

if (isServer()) {
    // useLayoutEffect warnings ssr disable
    (React as any).useLayoutEffect = React.useEffect;
}

saveCommonComponent(ECommonComponentNames.ProductCard, ProductCard);
saveCommonComponent(ECommonComponentNames.PostCard, PostCard);


function App(props: AppProps) {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        jssStyles?.parentElement?.removeChild(jssStyles);

        getUser();

        if (!isServer()) {
            getRestApiClient()?.onError((info) => {
                if (info.statusCode === 429) {
                    toast.error('Too many requests. Try again later');
                }
            }, '_app');
        }
    }, []);

    const getUser = async () => {
        const userInfo = getStoreItem('userInfo');
        if (!userInfo) {
            try {
                const user = await getRestApiClient()?.getUserInfo();
                if (user) {
                    setStoreItem('userInfo', user);
                }
            } catch (e) { }
        }
    }

    return (
        <>
            {props.Component && <props.Component {...(props.pageProps ?? {})} />}
            {!isServer() && document?.body && ReactDOM.createPortal(
                <div className={"global-toast"} ><ToastContainer /></div>, document.body)}
        </>
    )
}

export default App;

