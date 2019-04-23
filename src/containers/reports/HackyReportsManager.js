/*
 * @flow
 */

import React, { Component } from 'react';

import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  withRouter,
} from 'react-router';
import type { Match } from 'react-router';

import HackyBehavioralHealthReportEditContainer from './HackyBehavioralHealthReportEditContainer';
import HackyBehavioralHealthReportViewContainer from './HackyBehavioralHealthReportViewContainer';
import HackyReportsContainer from './HackyReportsContainer';
import { isValidUuid } from '../../utils/Utils';
import {
  REPORT_EDIT_PATH,
  REPORT_ID_PARAM,
  REPORT_VIEW_PATH,
  REPORTS_PATH,
} from '../../core/router/Routes';
import CrisisReportView from './CrisisReportView';

type Props = {
  reports :List<*>;
};

class HackyReportsManager extends Component<Props> {

  renderEdit = (props :Object) => {

    const { reports } = this.props;
    if (reports.isEmpty()) {
      return (
        <Redirect to={REPORTS_PATH} />
      );
    }

    const match :Match = props.match;
    const reportId :?string = match.params[REPORT_ID_PARAM.substr(1)];
    if (!isValidUuid(reportId)) {
      return (
        <Redirect to={REPORTS_PATH} />
      );
    }

    return (
      <HackyBehavioralHealthReportEditContainer {...props} />
    );
  }

  renderView = (props :Object) => {

    const { reports } = this.props;
    if (reports.isEmpty()) {
      return (
        <Redirect to={REPORTS_PATH} />
      );
    }

    const match :Match = props.match;
    const reportId :?string = match.params[REPORT_ID_PARAM.substr(1)];
    if (!isValidUuid(reportId)) {
      return (
        <Redirect to={REPORTS_PATH} />
      );
    }

    return (
      <HackyBehavioralHealthReportViewContainer {...props} />
    );
  }

  render() {

    // NOTE: this.renderEdit and this.renderView exist to allow for checks before routing to those components
    return (
      <Switch>
        <Route exact path={REPORTS_PATH} component={HackyReportsContainer} />
        {/* <Route path={REPORT_VIEW_PATH} component={CrisisTemplateContainer} /> */}
        {/* <Route path={REPORT_VIEW_PATH} render={this.renderView} /> */}
        <Route path={REPORT_VIEW_PATH} component={CrisisReportView} />
        <Route path={REPORT_EDIT_PATH} render={this.renderEdit} />
        <Redirect to={REPORTS_PATH} />
      </Switch>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    reports: state.getIn(['reports', 'reports'], List()),
  };
}

export default withRouter(
  connect(mapStateToProps)(HackyReportsManager)
);
