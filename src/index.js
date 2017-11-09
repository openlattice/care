/*
 * @flow
 */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { normalize } from 'polished';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { injectGlobal } from 'styled-components';

import AuthRoute from './core/auth/AuthRoute';
import initializeReduxStore from './core/redux/ReduxStore';
import initializeRouterHistory from './core/router/RouterHistory';
import * as Auth0 from './core/auth/Auth0';
import * as AuthUtils from './core/auth/AuthUtils';
import * as Routes from './core/router/Routes';
import * as Utils from './utils/Utils';

import AppContainer from './containers/app/AppContainer';
import ScrollToTop from './containers/app/ScrollToTop';

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

/*
 * // !!! MUST HAPPEN FIRST !!!
 */
Auth0.initialize();
Utils.configureLattice(AuthUtils.getAuthToken());
/*
 * // !!! MUST HAPPEN FIRST !!!
 */

const routerHistory = initializeRouterHistory();
const reduxStore = initializeReduxStore(routerHistory);

ReactDOM.render(
  <Provider store={reduxStore}>
    <ConnectedRouter history={routerHistory}>
      <ScrollToTop>
        <AuthRoute path={Routes.ROOT} component={AppContainer} />
      </ScrollToTop>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
