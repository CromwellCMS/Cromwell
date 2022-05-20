import { getStoreItem, matchPermissions, onStoreChange, setStoreItem } from '@cromwell/core';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import deepEqual from 'fast-deep-equal/es6';
import React, { Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useForceUpdate } from '../../helpers/forceUpdate';
import { LayoutPortal } from '../../helpers/LayoutPortal';
import { getPageInfos } from '../../helpers/navigation';
import Page404 from '../../pages/404/404page';
import { store } from '../../redux/store';
import PageErrorBoundary from '../errorBoundaries/PageErrorBoundary';
import FileManager from '../fileManager/FileManager';
import { ConfirmPrompt } from '../modal/Confirmation';
import SideNav from '../sideNav/SideNav';
import styles from './Layout.module.scss';

let userRoles = getStoreItem('userInfo')?.roles;

function Layout() {
  const forceUpdate = useForceUpdate();
  setStoreItem('forceUpdatePage', forceUpdate);
  const settings = getStoreItem('cmsSettings');

  onStoreChange('userInfo', (user) => {
    if (user && user.roles !== userRoles) {
      if (!deepEqual(userRoles, user.roles)) {
        userRoles = user.roles;
        forceUpdate();
      }
    }
  });

  useEffect(() => {
    store.setStateProp({
      prop: 'forceUpdateApp',
      payload: forceUpdate,
    });
  }, []);

  const darkMode = getStoreItem('theme')?.mode === 'dark';

  document.body.classList.remove('modeDark', 'modeLight', 'dark', 'light');
  document.body.classList.add(darkMode ? 'modeDark' : 'modeLight');
  document.body.classList.add(darkMode ? 'dark' : 'light');

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
      <div className="min-h-screen bg-gray-100 relative dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <BrowserRouter basename={'admin'}>
            <SideNav />
            <div className="flex flex-col w-full">
              {/* <Toolbar className={styles.dummyToolbar} /> */}
              <Switch>
                {getPageInfos().map(page => {
                  if (page.permissions?.length && !matchPermissions(getStoreItem('userInfo'), page.permissions))
                    return null;
                  if (page.module && !settings?.modules?.[page.module]) return null;

                  return (
                    <Route exact={!page.baseRoute}
                      path={page.route}
                      key={page.name}
                      component={(props: RouteComponentProps) => {
                        return (
                          <PageErrorBoundary>
                            <Suspense fallback={/*<LoadBox />*/<></>}>
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
      </div>
    </ThemeProvider>
  );
}

export default Layout;

