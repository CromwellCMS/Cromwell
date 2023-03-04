import { BrowserHistory, createBrowserHistory } from 'history';
import React, { useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';

export function BrowserRouter({ children }: { children: React.ReactNode }) {
  const historyRef = React.useRef<BrowserHistory>();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window });
  }

  const history = historyRef.current;
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });
  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router basename={'admin'} location={state.location} navigationType={state.action} navigator={history}>
      {children}
    </Router>
  );
}
