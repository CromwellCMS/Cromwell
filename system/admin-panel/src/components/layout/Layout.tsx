import '../../styles/global.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'pure-react-carousel/dist/react-carousel.es.css';

import { createMuiTheme, ThemeProvider, Toolbar } from '@material-ui/core';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { pageInfos } from '../../constants/PageInfos';
import Page404 from '../../pages/404/404page';
import PageErrorBoundary from '../errorBoundaries/PageErrorBoundary';
import FileManager from '../fileManager/FileManager';
import LoadBox from '../loadBox/LoadBox';
import Sidebar from '../sidebar/Sidebar';
import styles from './Layout.module.scss';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#673ab7',
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

function Layout() {

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.Layout}>
        <HashRouter>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.main}>
            <Toolbar className={styles.dummyToolbar} />
            <Switch>
              {pageInfos.map(page => {
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
            <div className={styles.iconsCredits} >Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a>, <a href="https://icon54.com/" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
          </div>
        </HashRouter>
        {document?.body && ReactDOM.createPortal(
          <div className={styles.toastContainer} ><ToastContainer /></div>, document.body)}
        <FileManager />
      </div>
    </ThemeProvider>
  );
}

export default Layout;