/*
 * @flow
 */

import React from 'react';

import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

import CrisisReportContainer from './crisis/CrisisReportContainer';
import CrisisReportView from './CrisisReportView';
import SearchReportsContainer from './SearchReportsContainer';

import {
  CRISIS_REPORT_PATH,
  REPORTS_PATH,
  REPORT_VIEW_PATH
} from '../../core/router/Routes';

const LegitReportsRouter = () => (
  <Switch>
    <Route exact path={REPORTS_PATH} component={SearchReportsContainer} />
    <Route path={REPORT_VIEW_PATH} component={CrisisReportView} />
    <Route path={CRISIS_REPORT_PATH} component={CrisisReportContainer} />
    <Redirect to={REPORTS_PATH} />
  </Switch>
);

export default LegitReportsRouter;
