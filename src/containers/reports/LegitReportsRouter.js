/*
 * @flow
 */

import React from 'react';

import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

// import HackyReportsContainer from './HackyReportsContainer';
import SearchReports from './SearchReports';
import {
  REPORT_VIEW_PATH,
  REPORTS_PATH,
} from '../../core/router/Routes';
import CrisisReportView from './CrisisReportView';

const LegitReportsRouter = () => (
  <Switch>
    <Route exact path={REPORTS_PATH} component={SearchReports} />
    <Route path={REPORT_VIEW_PATH} component={CrisisReportView} />
    <Redirect to={REPORTS_PATH} />
  </Switch>
);

export default LegitReportsRouter;
