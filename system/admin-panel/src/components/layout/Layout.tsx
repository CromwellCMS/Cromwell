import { getStoreItem, onStoreChange, setStoreItem } from '@cromwell/core';
import { ThemeProvider, Toolbar } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import clsx from 'clsx';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { getPageInfos } from '../../constants/PageInfos';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { LayoutPortal } from '../../helpers/LayoutPortal';
import Page404 from '../../pages/404/404page';
import PageErrorBoundary from '../errorBoundaries/PageErrorBoundary';
import FileManager from '../fileManager/FileManager';
import LoadBox from '../loadBox/LoadBox';
import { ConfirmPrompt } from '../modal/Confirmation';
import Sidebar from '../sidebar/Sidebar';
import styles from './Layout.module.scss';

let userRole = getStoreItem('userInfo')?.role;

function Layout() {
  const forceUpdate = useForceUpdate();
  setStoreItem('forceUpdatePage', forceUpdate);

  onStoreChange('userInfo', (user) => {
    if (user && user.role !== userRole) {
      userRole = user.role;
      forceUpdate();
    }
  })

  const darkMode = getStoreItem('theme')?.mode === 'dark';

  document.body.classList.remove('modeDark', 'modeLight');
  document.body.classList.add(darkMode ? 'modeDark' : 'modeLight');

  const theme = createTheme(darkMode ? {
    palette: {
      primary: {
        main: '#9747d3',
        light: '#9747d3',
        dark: '#8228c5',
      },
      secondary: {
        main: '#910081',
        light: '#910081',
        dark: '#910081',
      }
    },
  } : {
    palette: {
      primary: {
        main: '#8228c5',
        light: '#8561c5',
        dark: '#482880',
      },
      secondary: {
        main: '#910081',
        light: '#910081',
        dark: '#910081',
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={clsx(styles.Layout)}>
        <BrowserRouter basename={'admin'}>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.main}>
            <Toolbar className={styles.dummyToolbar} />
            <Switch>
              {getPageInfos().map(page => {
                if (page.roles && !page.roles.includes(getStoreItem('userInfo')?.role))
                  return null;
                return (
                  <Route exact={!page.baseRoute}
                    path={page.route}
                    key={page.name}
                    component={(props: RouteComponentProps) => {
                      return (
                        <PageErrorBoundary>
                          <Suspense fallback={<LoadBox />}>
                            <page.component {...props} />
                          </Suspense>
                        </PageErrorBoundary>
                      )
                    }}
                  />
                )
              })}
              <Route key={'404'} >
                <Page404 />
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
        {document?.body && ReactDOM.createPortal(
          <div className={styles.toastContainer} ><ToastContainer /></div>, document.body)}
        <FileManager />
        <ConfirmPrompt />
        <LayoutPortal />
      </div>
    </ThemeProvider>
  );
}

export default Layout;

