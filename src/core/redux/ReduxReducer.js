/*
 * @flow
 */

import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';
import bhrReducer from '../../containers/form/ReportReducer';
import followupReducer from '../../containers/followup/FollowUpReportReducer';
import hospitalsReducer from '../../containers/form/HospitalsReducer';
import reportsReducer from '../../containers/reports/ReportsReducer';
import searchReducer from '../../containers/search/SearchReducer';

export default function reduxReducer() {

  return combineReducers({
    app: appReducer,
    auth: AuthReducer,
    followUpReport: followupReducer,
    hospitals: hospitalsReducer,
    report: bhrReducer,
    reports: reportsReducer,
    search: searchReducer
  });
}
