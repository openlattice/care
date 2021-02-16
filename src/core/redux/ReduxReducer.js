/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';
import authorizeReducer from '../sagas/authorize/AuthorizeReducer';
import crisisReportReducer from '../../containers/reports/crisis/CrisisReportReducer';
import dashboardReducer from '../../containers/dashboard/DashboardReducer';
// pages
import dispositionReducer from '../../containers/pages/disposition/Reducer';
import documentsReducer from '../../containers/documents/DocumentsReducer';
import downloadsReducer from '../../containers/downloads/DownloadsReducer';
import edmReducer from '../../edm/EdmReducer';
import exploreReducer from '../../containers/explore/ExploreReducer';
import exportBulkReducer from '../../containers/reports/export/ExportBulkReducer';
import exportReducer from '../../containers/reports/export/ExportReducer';
import formSchemasReducer from '../../containers/reports/FormSchemasReducer';
import hospitalsReducer from '../../containers/form/HospitalsReducer';
import incidentsReducer from '../../containers/reports/IncidentsReducer';
import issuesReducer from '../../containers/issues/IssuesReducer';
import longBeachReducer from '../../longbeach/LongBeachReducer';
import natureOfCrisisReducer from '../../containers/pages/natureofcrisis/Reducer';
import observedBehaviorsReducer from '../../containers/pages/observedbehaviors/Reducer';
import officerSafetyReducer from '../../containers/pages/officersafety/Reducer';
import peopleReducer from '../../containers/people/PeopleReducer';
import profileReducer from '../../containers/profile/reducers/ProfileReducer';
import recentInteractionReducer from '../../containers/reports/interaction/RecentInteractionReducer';
import reportsReducer from '../../containers/reports/ReportsReducer';
import staffReducer from '../../containers/staff/StaffReducer';
import subjectInformationReducer from '../../containers/pages/subjectinformation/Reducer';
import subscriptionReducer from '../../containers/subscriptions/SubscriptionReducer';
import symptomsReportReducer from '../../containers/reports/symptoms/SymptomsReportReducer';
import { SWITCH_ORGANIZATION } from '../../containers/app/AppActions';
import { STATE } from '../../utils/constants/StateConstants';

export default function reduxReducer(routerHistory :any) {

  const allReducers = combineReducers({
    app: appReducer,
    auth: AuthReducer,
    authorization: authorizeReducer,
    crisisReport: crisisReportReducer,
    dashboard: dashboardReducer,
    documents: documentsReducer,
    downloads: downloadsReducer,
    edm: edmReducer,
    explore: exploreReducer,
    export: exportReducer,
    exportBulk: exportBulkReducer,
    formSchemas: formSchemasReducer,
    hospitals: hospitalsReducer,
    incidents: incidentsReducer,
    issues: issuesReducer,
    longBeach: longBeachReducer,
    people: peopleReducer,
    profile: profileReducer,
    recentInteractions: recentInteractionReducer,
    reports: reportsReducer,
    router: connectRouter(routerHistory),
    staff: staffReducer,
    symptomsReport: symptomsReportReducer,

    // page reducers
    [STATE.DISPOSITION]: dispositionReducer,
    [STATE.NATURE_OF_CRISIS]: natureOfCrisisReducer,
    [STATE.OBSERVED_BEHAVIORS]: observedBehaviorsReducer,
    [STATE.OFFICER_SAFETY]: officerSafetyReducer,
    [STATE.SUBJECT_INFORMATION]: subjectInformationReducer,
    [STATE.SUBSCRIPTIONS]: subscriptionReducer
  });

  const rootReducer = (state, action) => {
    // reset app state when switching
    if (action.type === SWITCH_ORGANIZATION) {
      return allReducers(undefined, action);
    }

    return allReducers(state, action);
  };

  return rootReducer;
}
