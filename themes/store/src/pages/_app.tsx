import * as React from 'react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { ProductCard } from '../components/productCard/ProductCard';
import { PostCard } from '../components/postCard/PostCard';
import { ECommonComponentNames, saveCommonComponent, isServer, getStoreItem, setStoreItem } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import ReactDOM from 'react-dom';

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
    }, []);

    const getUser = async () => {
        const userInfo = getStoreItem('userInfo');
        if (!userInfo) {
            try {
                const user = await getRestAPIClient()?.getUserInfo();
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
            <div style={{ fontSize: '12px' }}>Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a>, <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a>, <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a>, <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a>, <a href="https://www.flaticon.com/authors/itim2101" title="itim2101">itim2101</a>, <a href="https://creativemarket.com/eucalyp" title="Eucalyp">Eucalyp</a>  from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>; <a href="https://www.vecteezy.com/free-vector/banner-cdr">Banner Cdr Vectors by Vecteezy</a>; <a href="https://www.vecteezy.com/free-vector/banner">Banner Vectors by Vecteezy</a>
            </div>
        </>
    )
}

export default App;

