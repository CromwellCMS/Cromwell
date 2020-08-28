import '../styles/global.scss';
import React from 'react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { ProductCard } from '../components/productCard/ProductCard';
import { ECommonComponentNames, saveCommonComponent } from '@cromwell/core';
saveCommonComponent(ECommonComponentNames.ProductCard, ProductCard);

function App(props: AppProps) {
    return (
        <>
            <props.Component {...props.pageProps} />
            <ToastContainer />
        </>
    )
}

export default App