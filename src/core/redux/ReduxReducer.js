/*
 * @flow
 */

import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/form/AppReducer';
import bhrReducer from '../../containers/form/ReportReducer';
import followupReducer from '../../containers/followup/FollowUpReportReducer';
import searchReducer from '../../containers/search/SearchReducer';

export default function reduxReducer() {

  return combineReducers({
    app: appReducer,
    auth: AuthReducer,
    report: bhrReducer,
    followUpReport: followupReducer,
    search: searchReducer
  });
}
