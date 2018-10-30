/*
 * @flow
 */

import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';
import bhrReducer from '../../containers/form/ReportReducer';
import dashboardReducer from '../../containers/dashboard/DashboardReducer';
import downloadsReducer from '../../containers/downloads/DownloadsReducer';
import edmReducer from '../../edm/EdmReducer';
import followupReducer from '../../containers/followup/FollowUpReportReducer';
import hospitalsReducer from '../../containers/form/HospitalsReducer';
import peopleReducer from '../../containers/people/PeopleReducer';
import reportsReducer from '../../containers/reports/ReportsReducer';
import searchReducer from '../../containers/search/SearchReducer';

export default function reduxReducer() {

  return combineReducers({
    app: appReducer,
    auth: AuthReducer,
    dashboard: dashboardReducer,
    downloads: downloadsReducer,
    edm: edmReducer,
    followUpReport: followupReducer,
    hospitals: hospitalsReducer,
    people: peopleReducer,
    report: bhrReducer,
    reports: reportsReducer,
    search: searchReducer
  });
}
