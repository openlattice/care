/*
 * @flow
 */

import React from 'react';

import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

import CrisisReportClinicianContainer from './crisis/CrisisReportClinicianContainer';
import CrisisReportContainer from './crisis/CrisisReportContainer';
import CrisisReportView from './CrisisReportView';
import FollowupReportContainer from './crisis/FollowupReportContainer';
import SearchReportsContainer from './SearchReportsContainer';

import {
  CRISIS_REPORT_CLINICIAN_PATH,
  CRISIS_REPORT_PATH,
  FOLLOW_UP_REPORT_PATH,
  REPORTS_PATH,
  REPORT_VIEW_PATH,
} from '../../core/router/Routes';

const LegitReportsRouter = () => (
  <Switch>
    <Route exact path={REPORTS_PATH} component={SearchReportsContainer} />
    <Route path={REPORT_VIEW_PATH} component={CrisisReportView} />
    <Route path={CRISIS_REPORT_PATH} component={CrisisReportContainer} />
    <Route path={CRISIS_REPORT_CLINICIAN_PATH} component={CrisisReportClinicianContainer} />
    <Route path={FOLLOW_UP_REPORT_PATH} component={FollowupReportContainer} />
    <Redirect to={REPORTS_PATH} />
  </Switch>
);

export default LegitReportsRouter;
