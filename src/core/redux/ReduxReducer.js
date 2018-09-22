/*
 * @flow
 */

import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';
import bhrReducer from '../../containers/form/ReportReducer';
import followupReducer from '../../containers/followup/FollowUpReportReducer';
import hospitalsReducer from '../../containers/form/HospitalsReducer';
import searchReducer from '../../containers/search/SearchReducer';

export default function reduxReducer() {

  return combineReducers({
    app: appReducer,
    auth: AuthReducer,
    followUpReport: followupReducer,
    hospitals: hospitalsReducer,
    report: bhrReducer,
    search: searchReducer
  });
}
