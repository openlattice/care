/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';

import ButtonToolbar from '../../components/buttons/ButtonToolbar';
import SummaryStats from '../../components/dashboard/SummaryStats';
import OverviewCharts from '../../components/dashboard/OverviewCharts';
import OutcomeCharts from '../../components/dashboard/OutcomeCharts';
import LoadingSpinner from '../../components/LoadingSpinner';
import { loadDashboardData } from './DashboardActionFactory';
import { SUBMISSION_STATES } from './DashboardReducer';

type Props = {
  app :Map,
  dashboardCounts :Map,
  isLoading :boolean,
  summaryStats :Map,
  actions :{
    loadDashboardData :() => void
  }
};

type State = {
  layout :string
};

const LAYOUTS = {
  OVERVIEW: 'Overview',
  OUTCOMES: 'Outcomes'
};

class DashboardContainer extends React.Component<Props, State>  {

  constructor(props :Props) {
    super(props);
    this.state = {
      layout: LAYOUTS.OVERVIEW
    };
  }

  componentDidMount() {
    const { actions, app } = this.props;
    actions.loadDashboardData({ app });
  }

  renderContent = () => {
    const { dashboardCounts, summaryStats } = this.props;
    const { layout } = this.state;

    const ChartsComponent = layout === LAYOUTS.OVERVIEW ? OverviewCharts : OutcomeCharts;

    const viewOptions = Object.values(LAYOUTS).map((value) => ({
      label: value,
      value,
      onClick: () => this.setState({ layout: value })
    }));

    return (
      <div>
        <SummaryStats summaryStats={summaryStats} />
        <ButtonToolbar options={viewOptions} value={layout} />
        <ChartsComponent dashboardCounts={dashboardCounts} />
      </div>
    );
  }

  render() {
    const { isLoading } = this.props;

    return (
      <div>
        {isLoading ? <LoadingSpinner /> : this.renderContent()}
      </div>
    );
  }
};

function mapStateToProps(state :Map<*, *>) :Object {
  const dashboard = state.get('dashboard');

  return {
    app: state.get('app', Map()),
    dashboardCounts: dashboard.get('dashboardCounts'),
    isLoading: dashboard.get('submissionState') === SUBMISSION_STATES.IS_SUBMITTING,
    summaryStats: dashboard.get('summaryStats')
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    loadDashboardData
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
