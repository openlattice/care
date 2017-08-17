/*
 * @flow
 */

import { combineReducers } from 'redux-immutable';

import authReducer from '../auth/AuthReducer';
import routerReducer from '../router/RouterReducer';

export default function reduxReducer() {

  return combineReducers({
    auth: authReducer,
    router: routerReducer
  });
}
