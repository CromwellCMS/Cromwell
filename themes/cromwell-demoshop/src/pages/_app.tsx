import * as React from 'react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { ProductCard } from '../components/productCard/ProductCard';
import { ECommonComponentNames, saveCommonComponent, isServer } from '@cromwell/core';

if (isServer()) {
    // useLayoutEffect warnings ssr disable
    (React as any).useLayoutEffect = React.useEffect;
}

saveCommonComponent(ECommonComponentNames.ProductCard, ProductCard);


function App(props: AppProps) {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        jssStyles?.parentElement?.removeChild(jssStyles);
    }, []);

    return (
        <>
            {props.Component && <props.Component {...(props.pageProps ?? {})} />}
            <ToastContainer />
            <div style={{ fontSize: '12px' }}>Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
        </>
    )
}

export default App