import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, List, fromJS, toJS } from 'immutable';

import ReportSearchResult from '../search/ReportSearchResult';
import { getBHRReports } from './ReportSummariesActionFactory';
import { REQUEST_STATUSES } from './ReportSummariesReducer';
import { APP_TYPES_FQNS, REPORT_INFO, ENTITY_ID } from '../../shared/Consts';
import { ContainerInnerWrapper, ContainerOuterWrapper } from '../../shared/Layout';

const {
  BEHAVIORAL_HEALTH_REPORT_FQN
} = APP_TYPES_FQNS;


class ReportsListContainer extends React.Component {
  componentWillMount() {
    this.props.actions.getBHRReports({
      entitySetId: this.props.bhrEntitySetId,
      propertyTypeIds: []
    });
  }

  renderListItems = () => {
    const { reports } = this.props;
    const showDivider = reports.size > 1;

    return reports && reports
      .sort((a,b) => {
        const dateA = new Date(a.getIn([REPORT_INFO.DATE_REPORTED_FQN, 0], null));
        const dateB = new Date(b.getIn([REPORT_INFO.DATE_REPORTED_FQN, 0], null));
        return dateB - dateA;
      })
      .map(
        report => (
          <ReportSearchResult
              searchResult={report}
              onSelectSearchResult={this.props.onSelectSearchResult}
              showDivider={showDivider}
              key={report.getIn([ENTITY_ID, 0], '')} />
      )
    )
  }

  render() {

    return (
      <ContainerOuterWrapper>
        <ContainerInnerWrapper>
          { this.renderListItems() }
        </ContainerInnerWrapper>
      </ContainerOuterWrapper>
    );
  }
};

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganization'], '');

  const bhrEntitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ], '');

  const reports = state.getIn([
    'reportSummaries',
    'reports'
  ], List());

  return {
    bhrEntitySetId,
    reports
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ getBHRReports }, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReportsListContainer)
);