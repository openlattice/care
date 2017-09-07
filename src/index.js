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

  * {
        margin: 0;
        padding: 0;
        border: 0;
        outline: 0;
        font-size: 100%;
        vertical-align: baseline;
        background: transparent;
    }

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

// TODO: reimplement this routing
// TODO: I'm so confused now... how is this even working?!
ReactDOM.render(
  <Provider store={reduxStore}>
    <ConnectedRouter history={routerHistory}>
      <div>
        <Switch>
          <AuthRoute path="/" component={Form} />
          <Route component={AuthContainer} />
          <Redirect to="/" />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
