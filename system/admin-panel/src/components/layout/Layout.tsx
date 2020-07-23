import 'gridlex/src/gridlex.scss';
import 'reset-css';

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { pageInfos } from '../../constants/PageInfos';
import Header from '../header/Header';
import Page from '../page/Page';
import Sidebar from '../sidebar/Sidebar';
import classes from './Layout.module.scss';

function Layout() {
  return (
    <div className={classes.Layout}>
      <BrowserRouter>
        <div className={classes.header}>
          <Header />
        </div>
        <div className={classes.main}>
          <div className={classes.sidebar}>
            <Sidebar />
          </div>
          <div className={classes.content}>
            <Switch>
              {pageInfos.map(page => {
                return (
                  <Route exact path={page.route} key={page.name} >
                    <Page component={page.component} />
                  </Route>
                )
              })}
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default Layout;
