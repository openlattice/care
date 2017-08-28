/*
 * @flow
 */

import Auth0Lock from 'auth0-lock';

import * as RoutePaths from '../router/RoutePaths';
import * as AuthActionFactory from './AuthActionFactory';
import * as AuthUtils from './AuthUtils';

// injected by Webpack.DefinePlugin
declare var __AUTH0_CLIENT_ID__;
declare var __AUTH0_DOMAIN__;

let auth0Lock :Auth0Lock;

export function initializeAuth0Lock(reduxStore :any, auth0HashPath :?string) {

  /*
   * https://auth0.com/docs/libraries/lock/v10
   * https://auth0.com/docs/libraries/lock/v10/api
   * https://auth0.com/docs/libraries/lock/v10/customization
   */

  auth0Lock = new Auth0Lock(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, {
    auth: {
      autoParseHash: false,
      params: {
        scope: 'openid email user_id'
      },
      responseType: 'token'
    },
    closable: false,
    hashCleanup: false,
    languageDictionary: {
      title: 'Behavioral Health Report'
    }
  });

  auth0Lock.on('authorization_error', (error) => {
    reduxStore.dispatch(AuthActionFactory.authFailure(error));
  });

  auth0Lock.on('unrecoverable_error', (error) => {
    reduxStore.dispatch(AuthActionFactory.authFailure(error));
  });

  auth0Lock.on('authenticated', (authInfo :Object) => {
    if (!authInfo || !authInfo.accessToken || !authInfo.idToken) {
      reduxStore.dispatch(AuthActionFactory.authFailure('Auth0Lock onAuthenticated - missing auth info'));
    }
    else if (AuthUtils.hasAuthTokenExpired(authInfo.idToken)) {
      reduxStore.dispatch(AuthActionFactory.authFailure('Auth0Lock onAuthenticated - id token expired'));
    }
    else {
      reduxStore.dispatch(AuthActionFactory.authenticated(authInfo.idToken));
    }
  });

  if (auth0HashPath) {
    auth0Lock.resumeAuth(auth0HashPath, (error, authInfo) => {
      if (error || !authInfo || !authInfo.accessToken || !authInfo.idToken) {
        auth0Lock.show({
          flashMessage: {
            type: 'error',
            text: 'authentication failure'
          }
        });
      }
    });
  }
}

/*
 * Ideally, we should be using browser history and OIDC conformant authentication. Until then, we have to take extra
 * steps in the auth flow to handle the Auth0 redirect. Auth0 redirects back to "#access_token...", which will be
 * immediately replaced with "#/access_token..." when hash history is initializing:
 *
 * https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L38
 * https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L49
 *
 * Here, we grab the Auth0 response from the URL and redirect to "#/login", which avoids the need for hash history
 * to invoke window.location.replace().
 */
export function parseHashPath() {

  const href :string = window.location.href;
  const hashIndex :number = href.indexOf('#');
  const hashPath :string = hashIndex === -1 ? '' : href.substring(hashIndex + 1);

  // TODO: just checking for the existence of "access_token" and "id_token" isn't strong enough validation
  if (hashPath.indexOf('access_token') !== -1 && hashPath.indexOf('id_token') !== -1) {

    const urlBeforeHash :string = href.slice(0, hashIndex >= 0 ? hashIndex : 0);
    window.location.replace(`${urlBeforeHash}#${RoutePaths.LOGIN}`);
    return hashPath;
  }

  return '';
}

export function getAuth0LockInstance() :Auth0Lock {

  if (!auth0Lock) {
    throw new Error('Auth0Lock is not initialized!');
  }

  return auth0Lock;
}
