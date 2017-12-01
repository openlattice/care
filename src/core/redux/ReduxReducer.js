/*
 * @flow
 */

import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/form/AppReducer';
import authReducer from '../auth/AuthReducer';
import entitySetsReducer from '../../containers/form/EntitySetsReducer';
import reportReducer from '../../containers/form/ReportReducer';

export default function reduxReducer() {

  return combineReducers({
    app: appReducer,
    auth: authReducer,
    entitySets: entitySetsReducer,
    report: reportReducer
  });
}
