/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import { STATE } from '../../utils/constants/StateConstants';

import appReducer from '../../containers/app/AppReducer';
import dashboardReducer from '../../containers/dashboard/DashboardReducer';
import downloadsReducer from '../../containers/downloads/DownloadsReducer';
import edmReducer from '../../edm/EdmReducer';
import hospitalsReducer from '../../containers/form/HospitalsReducer';
import peopleReducer from '../../containers/people/PeopleReducer';
import reportsReducer from '../../containers/reports/ReportsReducer';
import searchReducer from '../../containers/search/SearchReducer';
import staffReducer from '../../containers/staff/StaffReducer';
import submitReducer from '../../utils/submit/SubmitReducer';
import subscribeReducer from '../../containers/subscribe/SubscribeReducer';

// pages
import dispositionReducer from '../../containers/pages/disposition/Reducer';
import natureOfCrisisReducer from '../../containers/pages/natureofcrisis/Reducer';
import observedBehaviorsReducer from '../../containers/pages/observedbehaviors/Reducer';
import officerSafetyReducer from '../../containers/pages/officersafety/Reducer';
import subjectInformationReducer from '../../containers/pages/subjectinformation/Reducer';

export default function reduxReducer(routerHistory :any) {

  return combineReducers({
    app: appReducer,
    auth: AuthReducer,
    dashboard: dashboardReducer,
    downloads: downloadsReducer,
    edm: edmReducer,
    hospitals: hospitalsReducer,
    people: peopleReducer,
    reports: reportsReducer,
    router: connectRouter(routerHistory),
    search: searchReducer,
    staff: staffReducer,

    // page reducers
    [STATE.DISPOSITION]: dispositionReducer,
    [STATE.NATURE_OF_CRISIS]: natureOfCrisisReducer,
    [STATE.OBSERVED_BEHAVIORS]: observedBehaviorsReducer,
    [STATE.OFFICER_SAFETY]: officerSafetyReducer,
    [STATE.SUBJECT_INFORMATION]: subjectInformationReducer,

    [STATE.SUBMIT]: submitReducer,
    [STATE.SUBSCRIBE]: subscribeReducer
  });
}
