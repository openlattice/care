/*
 * @flow
 */

import Immutable from 'immutable';

import * as AuthUtils from './AuthUtils';
import {
  AUTH_EXPIRED,
  AUTH_FAILURE,
  AUTH_SUCCESS,
  LOGOUT
} from './AuthActionFactory';

/*
 * constants
 */

const EXPIRED :number = -1;

/*
 * INITIAL_STATE depends on localStorage. if localStorage holds the Auth0 id token, and it has not yet expired,
 * then the user is considered to be authenticated.
 */
const INITIAL_STATE :Map<*, *> = Immutable.Map().withMutations((map :Map<*, *>) => {

  const expiration :number = AuthUtils.getAuthTokenExpiration();

  if (AuthUtils.hasAuthTokenExpired(expiration)) {
    map.set('authTokenExpiration', EXPIRED);
  }
  else {
    map.set('authTokenExpiration', expiration);
  }
});

function authReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case AUTH_SUCCESS:
      return state.set('authTokenExpiration', AuthUtils.getAuthTokenExpiration(action.authToken));

    case AUTH_EXPIRED:
    case AUTH_FAILURE:
    case LOGOUT:
      return state.set('authTokenExpiration', EXPIRED);

    default:
      return state;
  }
}

export default authReducer;
