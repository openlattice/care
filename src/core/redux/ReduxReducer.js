/*
 * @flow
 */

import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/form/AppReducer';
import authReducer from '../auth/AuthReducer';
import reportReducer from '../../containers/form/ReportReducer';
import searchReducer from '../../containers/search/SearchReducer';

export default function reduxReducer() {

  return combineReducers({
    app: appReducer,
    auth: authReducer,
    report: reportReducer,
    search: searchReducer
  });
}
