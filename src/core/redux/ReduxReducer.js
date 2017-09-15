/*
 * @flow
 */

import { combineReducers } from 'redux-immutable';

import authReducer from '../auth/AuthReducer';

export default function reduxReducer() {

  return combineReducers({
    auth: authReducer
  });
}
