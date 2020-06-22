import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Sidebar } from './sidebar/Sidebar';
import Page from './page/Page';
import { pageInfos } from '../constants/PageInfos';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        Cromwell Admin Panel
      <header className="App-header">

        </header>
        <Sidebar />
        <Switch>
          {pageInfos.map(page => {
            return (
              <Route exact path={page.route} key={page.name} >
                <Page component={page.component} />
              </Route>
            )
          })}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
