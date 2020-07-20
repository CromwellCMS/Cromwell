import 'reset-css';
import '../styles/global.scss';
import React from 'react';
import { AppProps } from 'next/app';

import { Product } from '../components/product/Product';
import { ECommonComponentNames, saveCommonComponent } from '@cromwell/core';
saveCommonComponent(ECommonComponentNames.product, Product);

function App(props: AppProps) {
    return <props.Component {...props.pageProps} />
}

export default App