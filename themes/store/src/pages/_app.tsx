import { ECommonComponentNames, isServer, saveCommonComponent, TCromwellPage } from '@cromwell/core';
import { getRestApiClient, usePagePropsContext } from '@cromwell/core-frontend';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import * as React from 'react';
import { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import { PostCard } from '../components/postCard/PostCard';
import { ProductCard } from '../components/productCard/ProductCard';
import { toast } from '../components/toast/toast';
import { createEmotionCache } from '../helpers/createEmotionCache';
import { getTheme } from '../helpers/theme';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

if (isServer()) {
  // Disable SSR useLayoutEffect warnings
  (React as any).useLayoutEffect = React.useEffect;
}

saveCommonComponent(ECommonComponentNames.ProductCard, ProductCard);
saveCommonComponent(ECommonComponentNames.PostCard, PostCard);

export type TPageWithLayout<TProps = any> = TCromwellPage<TProps> & {
  getLayout?: (page: ReactElement) => JSX.Element;
}

type AppPropsWithLayout = AppProps & {
  Component: TPageWithLayout;
  emotionCache?: EmotionCache;
}

function App(props: AppPropsWithLayout) {
  const pageContext = usePagePropsContext();
  const { Component, emotionCache = clientSideEmotionCache } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const theme = getTheme(pageContext.pageProps?.cmsProps?.palette);

  React.useEffect(() => {
    if (!isServer()) {
      getRestApiClient()?.onError((info) => {
        if (info.statusCode === 429) {
          toast.error('Too many requests. Try again later');
        }
      }, '_app');
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        {getLayout(<>
          {Component && <Component {...(props.pageProps ?? {})} />}
          {!isServer() && document?.body && ReactDOM.createPortal(
            <div className={"global-toast"} ><ToastContainer /></div>, document.body)}
        </>)}
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;