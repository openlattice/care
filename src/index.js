/*
 * @flow
 */

import React from 'react';
import ReactDOM from 'react-dom';

import LatticeAuth from 'lattice-auth';
import { normalize } from 'polished';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { injectGlobal } from 'styled-components';

import AppContainer from './containers/app/AppContainer';
import initializeReduxStore from './core/redux/ReduxStore';
import initializeRouterHistory from './core/router/RouterHistory';
import * as Routes from './core/router/Routes';
import { getLatticeConfigBaseUrl } from './utils/Utils';

// injected by Webpack.DefinePlugin
declare var __AUTH0_CLIENT_ID__ :string;
declare var __AUTH0_DOMAIN__ :string;
declare var __ENV_DEV__ :boolean;

const {
  AuthRoute,
  AuthUtils
} = LatticeAuth;

/* eslint-disable */
injectGlobal`${normalize()}`;

injectGlobal`
  html,
  body {
    background-color: #f9fcff;
    color: #135;
    font-family: 'Open Sans', sans-serif;
    height: 100%;
    width: 100%;
  }

  * {
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
  }

  *:before,
  *:after {
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
  }

  #app {
    display: block;
    height: 100%;
    width: 100%;
  }
`;
/* eslint-enable */

/*
 * // !!! MUST HAPPEN FIRST !!!
 */

LatticeAuth.configure({
  auth0ClientId: __AUTH0_CLIENT_ID__,
  auth0Domain: __AUTH0_DOMAIN__,
  authToken: AuthUtils.getAuthToken(),
  baseUrl: getLatticeConfigBaseUrl(),
});

/*
 * // !!! MUST HAPPEN FIRST !!!
 */

const routerHistory = initializeRouterHistory();
const reduxStore = initializeReduxStore(routerHistory);

const APP_ROOT_NODE = document.getElementById('app');
if (APP_ROOT_NODE) {
  ReactDOM.render(
    <Provider store={reduxStore}>
      <ConnectedRouter history={routerHistory}>
        <AuthRoute path={Routes.ROOT} component={AppContainer} redirectToLogin />
      </ConnectedRouter>
    </Provider>,
    APP_ROOT_NODE
  );
}
