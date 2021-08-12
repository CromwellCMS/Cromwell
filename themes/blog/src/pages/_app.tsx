import React from 'react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

function App(props: AppProps) {
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        jssStyles?.parentElement?.removeChild(jssStyles);
    }, []);

    return (
        <>
            <props.Component {...props.pageProps} />
            <ToastContainer />
        </>
    )
}

export default App;