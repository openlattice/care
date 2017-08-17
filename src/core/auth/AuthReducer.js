/*
 * @flow
 */

import Immutable from 'immutable';

import * as AuthActionTypes from './AuthActionTypes';
import * as AuthUtils from './AuthUtils';

/*
 * INITIAL_STATE depends on localStorage. if localStorage holds the Auth0 ID token, and it has not yet expired,
 * then the user is considered to be logged in.
 */
const INITIAL_STATE :Map<> = Immutable.Map().withMutations((map :Map<>) => {
  map.set('isLoggedIn', AuthUtils.isLoggedIn());
});

function authReducer(state :Map<> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case AuthActionTypes.LOGGED_IN:
      return state.set('isLoggedIn', true);

    case AuthActionTypes.LOGOUT:
      return state.set('isLoggedIn', false);

    default:
      return state;
  }
}

export default authReducer;
