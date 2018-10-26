/*
 * @flow
 */

import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import { STATE } from '../../utils/constants/StateConstants';

import appReducer from '../../containers/app/AppReducer';
import bhrReducer from '../../containers/form/ReportReducer';
import dashboardReducer from '../../containers/dashboard/DashboardReducer';
import edmReducer from '../../edm/EdmReducer';
import followupReducer from '../../containers/followup/FollowUpReportReducer';
import hospitalsReducer from '../../containers/form/HospitalsReducer';
import peopleReducer from '../../containers/people/PeopleReducer';
import reportsReducer from '../../containers/reports/ReportsReducer';
import searchReducer from '../../containers/search/SearchReducer';

// pages
import dispositionReducer from '../../containers/pages/disposition/Reducer';
import natureOfCrisisReducer from '../../containers/pages/natureofcrisis/Reducer';
import observedBehaviorsReducer from '../../containers/pages/observedbehaviors/Reducer';
import officerSafetyReducer from '../../containers/pages/officersafety/Reducer';
import subjectInformationReducer from '../../containers/pages/subjectinformation/Reducer';

export default function reduxReducer() {

  return combineReducers({
    app: appReducer,
    auth: AuthReducer,
    dashboard: dashboardReducer,
    edm: edmReducer,
    followUpReport: followupReducer,
    hospitals: hospitalsReducer,
    people: peopleReducer,
    report: bhrReducer,
    reports: reportsReducer,
    search: searchReducer,

    // page reducers
    [STATE.DISPOSITION]: dispositionReducer,
    [STATE.NATURE_OF_CRISIS]: natureOfCrisisReducer,
    [STATE.OBSERVED_BEHAVIORS]: observedBehaviorsReducer,
    [STATE.OFFICER_SAFETY]: officerSafetyReducer,
    [STATE.SUBJECT_INFORMATION]: subjectInformationReducer
  });
}
