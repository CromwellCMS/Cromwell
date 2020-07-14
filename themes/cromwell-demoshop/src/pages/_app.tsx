import 'reset-css';
import '../styles/global.scss';
import React from 'react';
import { AppProps } from 'next/app';

function App(props: AppProps) {
    return <props.Component {...props.pageProps} />
}

export default App