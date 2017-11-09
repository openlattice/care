/*
 * @flow
 */

import Auth0Lock from 'auth0-lock';

import * as AuthUtils from './AuthUtils';

// injected by Webpack.DefinePlugin
declare var __AUTH0_CLIENT_ID__;
declare var __AUTH0_DOMAIN__;

/*
 * Auth0 Lock for Web
 * ------------------
 *
 * https://auth0.com/docs/libraries/lock/v10
 * https://auth0.com/docs/libraries/lock/v10/api
 * https://auth0.com/docs/libraries/lock/v10/customization
 *
 * OIDC Conformant Authentication
 * ------------------------------
 *
 * https://auth0.com/docs/api-auth/intro
 * https://auth0.com/docs/api-auth/which-oauth-flow-to-use
 * https://auth0.com/docs/api-auth/tutorials/adoption
 * https://auth0.com/docs/clients/client-types
 * https://auth0.com/docs/clients/client-grant-types
 *
 * Call APIs from Client-side Web Apps - https://auth0.com/docs/api-auth/grant/implicit
 * Authorization Code grant - https://auth0.com/docs/api-auth/tutorials/adoption/authorization-code
 * Implicit grant - https://auth0.com/docs/api-auth/tutorials/adoption/implicit
 * Resource Owner Password Credentials exchange - https://auth0.com/docs/api-auth/tutorials/adoption/password
 * Client Credentials exchange - https://auth0.com/docs/api-auth/tutorials/adoption/client-credentials
 */
const auth0Lock :Auth0Lock = new Auth0Lock(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, {
  auth: {
    autoParseHash: false,
    params: {
      scope: 'openid email user_id'
    },
    responseType: 'token id_token'
  },
  closable: false,
  hashCleanup: false,
  languageDictionary: {
    title: 'Behavioral Health Report'
  }
});

export function getAuth0LockInstance() :Auth0Lock {

  if (!auth0Lock) {
    throw new Error('Auth0Lock is not initialized!');
  }

  return auth0Lock;
}

export function authenticate() :Promise<*> {

  return new Promise((resolve :Function, reject :Function) => {

    auth0Lock.on('authorization_error', (error) => {
      reject(error);
    });

    auth0Lock.on('unrecoverable_error', (error) => {
      reject(error);
    });

    auth0Lock.on('authenticated', (authInfo :Object) => {
      if (!authInfo || !authInfo.accessToken || !authInfo.idToken) {
        reject('Auth0Lock onAuthenticated() - missing auth info');
      }
      else if (AuthUtils.hasAuthTokenExpired(authInfo.idToken)) {
        reject('Auth0Lock onAuthenticated() - id token expired');
      }
      else {
        resolve(authInfo.idToken);
      }
    });

    auth0Lock.show();
  });
}
