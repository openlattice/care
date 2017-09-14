/*
 * @flow
 */

import Immutable from 'immutable';

import * as AuthActionTypes from './AuthActionTypes';
import * as AuthUtils from './AuthUtils';

/*
 * INITIAL_STATE depends on localStorage. if localStorage holds the Auth0 id token, and it has not yet expired,
 * then the user is considered to be authenticated.
 */
const INITIAL_STATE :Map<*, *> = Immutable.Map().withMutations((map :Map<*, *>) => {

  const expiration :number = AuthUtils.getAuthTokenExpiration();

  if (AuthUtils.hasAuthTokenExpired(expiration)) {
    map.set('authTokenExpiration', -1);
  }
  else {
    map.set('authTokenExpiration', expiration);
  }
});

function authReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case AuthActionTypes.AUTH_SUCCESS:
      return state.set('authTokenExpiration', AuthUtils.getAuthTokenExpiration(action.authToken));

    case AuthActionTypes.AUTH_EXPIRED:
    case AuthActionTypes.AUTH_FAILURE:
    case AuthActionTypes.LOGOUT:
      return state.set('authTokenExpiration', -1);

    default:
      return state;
  }
}

export default authReducer;
