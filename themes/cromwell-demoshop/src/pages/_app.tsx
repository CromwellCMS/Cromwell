import '../styles/global.scss';
import React from 'react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { Product } from '../components/product/Product';
import { ECommonComponentNames, saveCommonComponent } from '@cromwell/core';
saveCommonComponent(ECommonComponentNames.product, Product);

function App(props: AppProps) {
    return (
        <>
            <props.Component {...props.pageProps} />
            <ToastContainer />
        </>
    )
}

export default App