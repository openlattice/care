/*
 * @flow
 */

import { combineReducers } from 'redux-immutable';

import authReducer from '../auth/AuthReducer';
import entitySetsReducer from '../../containers/form/EntitySetsReducer';
import reportReducer from '../../containers/form/ReportReducer';

export default function reduxReducer() {

  return combineReducers({
    auth: authReducer,
    entitySets: entitySetsReducer,
    report: reportReducer
  });
}
