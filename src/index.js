/*
 * @flow
 */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { normalize } from 'polished';
import { Provider } from 'react-redux';
import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { injectGlobal } from 'styled-components';

import AuthRoute from './core/auth/AuthRoute';
import initializeReduxStore from './core/redux/ReduxStore';
import initializeRouterHistory from './core/router/RouterHistory';
import * as Auth0 from './core/auth/Auth0';
import * as RoutePaths from './core/router/RoutePaths';

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

// !!! MUST !!! happen before initializing router history
// TODO: figure out a way to guarantee auth flow, either using promises or sagas
const auth0HashPath :string = Auth0.parseHashPath();

const routerHistory = initializeRouterHistory();
const reduxStore = initializeReduxStore(routerHistory);

Auth0.initializeAuth0Lock(reduxStore, auth0HashPath);

ReactDOM.render(
  <Provider store={reduxStore}>
    <ConnectedRouter history={routerHistory}>
      <Switch>
        <AuthRoute path={RoutePaths.ROOT} component={Form} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
