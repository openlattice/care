import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map } from 'immutable';


import ReportsListContainer from './ReportsListContainer';
import HealthReportSummaryContainer from './HealthReportSummaryContainer';
import * as Routes from '../../core/router/Routes';
import StyledCard from '../../components/cards/StyledCard';
import { ContainerInnerWrapper, ContainerOuterWrapper } from '../../shared/Layout';
import { APP_TYPES_FQNS } from '../../shared/Consts';


const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;


class ReportSummariesContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedReport: Map()
    };
  }

  onSelectSearchResult = (report) => {
    const { history } = this.props;
    this.setState(
      {
        selectedReport: report
      },
      () => {
        history.push(Routes.PAGE_2);
      }
    );
  }

  renderReportsList = () => (
    <ReportsListContainer onSelectSearchResult={this.onSelectSearchResult} />
  )

  renderReportSummary = () => (
    <HealthReportSummaryContainer selectedReport={this.state.selectedReport} />
  )

  render() {
    return (
      <Switch>
        <Route path={Routes.PAGE_1} render={this.renderReportsList} />
        <Route path={Routes.PAGE_2} render={this.renderReportSummary} />
        <Redirect to={Routes.PAGE_1} />
      </Switch>
    );
  }

  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired
  }
}

export default ReportSummariesContainer;
