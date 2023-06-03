import { LayoutSideNav } from '@components/sideNav/ResponsiveSideNav';
import { getStoreItem, matchPermissions } from '@cromwell/core';
import { LayoutPortal } from '@helpers/LayoutPortal';
import { getPageInfos } from '@helpers/navigation';
import { ThemeProvider } from '@mui/material';
import { store } from '@redux/store';
import Head from 'next/head';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux-ts';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Page404 from '../../router-pages/404/404page';
import PageErrorBoundary from '../errorBoundaries/PageErrorBoundary';
import FileManager from '../fileManager/FileManager';
import { ConfirmPrompt } from '../modal/Confirmation';
import { BrowserRouter } from './components/BrowserRouter';
import { useAppState } from './hooks/useAppState';
import { useTheme } from './hooks/useTheme';
import styles from './Layout.module.scss';

function Layout() {
  const theme = useTheme();
  const { settings, isReady } = useAppState();

  if (!isReady) return null;

  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="shortcut icon" type="image/png" href="/admin/static/icon_small.png" />
          <title>Cromwell CMS Admin Panel</title>
        </Head>
        <div suppressHydrationWarning className="min-h-screen bg-gray-100 relative dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <BrowserRouter>
              <LayoutSideNav />
              <div className={styles.main} id="main-scroll-container">
                {/* <Toolbar className={styles.dummyToolbar} /> */}
                <Routes>
                  {getPageInfos().map((page) => {
                    if (page.permissions?.length && !matchPermissions(getStoreItem('userInfo'), page.permissions))
                      return null;
                    if (page.module && !settings?.modules?.[page.module]) return null;

                    return (
                      <Route
                        path={page.route}
                        key={page.name}
                        element={
                          <PageErrorBoundary>
                            <Suspense fallback={/*<LoadBox />*/ <></>}>
                              <page.component />
                            </Suspense>
                          </PageErrorBoundary>
                        }
                      />
                    );
                  })}
                  <Route key={'404'} element={<Page404 />} />
                </Routes>
              </div>
            </BrowserRouter>
            {document?.body &&
              ReactDOM.createPortal(
                <div className={styles.toastContainer}>
                  <ToastContainer />
                </div>,
                document.body,
              )}
            <FileManager />
            <ConfirmPrompt />
            <LayoutPortal />
          </div>
        </div>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default Layout;
