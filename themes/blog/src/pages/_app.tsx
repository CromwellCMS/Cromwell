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
            <div style={{ fontSize: '12px' }}>Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
        </>
    )
}

export default App;