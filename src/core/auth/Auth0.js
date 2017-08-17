/*
 * @flow
 */

import Auth0Lock from 'auth0-lock';

import RoutePaths from '../router/RoutePaths';

import * as AuthActionFactory from './AuthActionFactory';

// injected by Webpack.DefinePlugin
declare var __AUTH0_CLIENT_ID__;
declare var __AUTH0_DOMAIN__;

/*
 * https://auth0.com/docs/libraries/lock/v10
 * https://auth0.com/docs/libraries/lock/v10/api
 * https://auth0.com/docs/libraries/lock/v10/customization
 */

let auth0Lock;

export default function initializeAuth0Lock(reduxStore :any) {

  auth0Lock = new Auth0Lock(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, {
    auth: {
      autoParseHash: true,
      redirect: true,
      redirectUrl: `${window.location.origin}${RoutePaths.AUTH}`,
      responseType: 'token'
    },
    closable: false,
    languageDictionary: {
      title: 'Behavioral Health Report'
    }
  });

  auth0Lock.on('authorization_error', (error) => {
    reduxStore.dispatch(AuthActionFactory.authError(error));
  });

  auth0Lock.on('unrecoverable_error', (error) => {
    reduxStore.dispatch(AuthActionFactory.authError(error));
  });

  auth0Lock.on('authenticated', (authInfo :Object) => {
    reduxStore.dispatch(AuthActionFactory.authenticated(authInfo));
  });

  return auth0Lock;
}

export function getAuth0LockInstance() :Auth0Lock {

  return auth0Lock;
}
