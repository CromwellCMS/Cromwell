import 'reset-css';
import React from 'react';
import { AppProps } from 'next/app';

function App(props: AppProps) {
    return <props.Component {...props.pageProps} />
}

export default App