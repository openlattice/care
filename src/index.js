/*
 * @flow
 */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { normalize } from 'polished';
import { Provider } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux';
import { injectGlobal } from 'styled-components';

import AuthContainer from './core/auth/AuthContainer';
import AuthRoute from './core/auth/AuthRoute';
import RoutePaths from './core/router/RoutePaths';

import initializeAuth0Lock from './core/auth/Auth0';
import initializeReduxStore from './core/redux/ReduxStore';
import initializeRouterHistory from './core/router/RouterHistory';

import Form from './containers/Form';

/* eslint-disable */
injectGlobal`${normalize()}`;

injectGlobal`

  html,
  body {
    height: 100%;
    width: 100%;
    font-family: 'Open Sans', sans-serif;
  }

  #app {
    height: 100%;
    width: 100%;
  }
`;
/* eslint-enable */

const routerHistory = initializeRouterHistory();
const reduxStore = initializeReduxStore(routerHistory);
initializeAuth0Lock(reduxStore);

ReactDOM.render(
  <Provider store={reduxStore}>
    <ConnectedRouter history={routerHistory}>
      <div>
        <Switch>
          <AuthRoute exact path={RoutePaths.ROOT} component={Form} />
          <Route path={RoutePaths.AUTH} component={AuthContainer} />
          <Redirect to={RoutePaths.ROOT} />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
