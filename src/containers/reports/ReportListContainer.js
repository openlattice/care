/*
 * @flow
 */

import React, { Component } from 'react';

import moment from 'moment';
import styled from 'styled-components';
import { Constants } from 'lattice';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import HackyBehavioralHealthReportViewContainer from './HackyBehavioralHealthReportViewContainer';
import Spinner from '../../components/spinner/Spinner';
import StyledCard from '../../components/cards/StyledCard';
import { getReportInFull, getReports } from './ReportsActions';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { REPORT_VIEW_PATH } from '../../core/router/Routes';
import {
  ContentContainerInnerWrapper,
  ContentContainerOuterWrapper,
} from '../../components/layout';

import {
  COMPLAINT_NUMBER_FQN,
  DATE_OCCURRED_FQN,
  DATE_REPORTED_FQN,
  DISPATCH_REASON_FQN,
  INCIDENT_FQN,
  LOCATION_OF_INCIDENT_FQN,
} from '../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;
const {
  BEHAVIORAL_HEALTH_REPORT_FQN,
} = APP_TYPES_FQNS;

const ReportDetailCard = styled(StyledCard)`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr 1fr 1fr;

  &:hover {
    cursor: pointer;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 14px;
    margin: 0 0 10px 0;
  }

  p {
    font-size: 12px;
    margin: 0;
  }
`;

type Props = {
  actions :{
    getReportInFull :RequestSequence;
    getReports :RequestSequence;
  };
  entitySetIds :{[key :string] :string};
  isFetchingReports :boolean;
  reports :List<*>;
};

class ReportListContainer extends Component<Props> {

  componentDidMount() {

    const { actions, entitySetIds } = this.props;
    actions.getReports({
      entitySetId: entitySetIds[BEHAVIORAL_HEALTH_REPORT_FQN.toString()],
    });
  }

  handleOnSelectReport = (report :Map<*, *>) => {

    const { actions, entitySetIds } = this.props;
    actions.getReportInFull({
      report,
      entitySetId: entitySetIds[BEHAVIORAL_HEALTH_REPORT_FQN.toString()],
    });
  }

  renderReports = () => {

    const { reports } = this.props;
    if (reports.isEmpty()) {
      return (
        <ContentContainerOuterWrapper>
          <ContentContainerInnerWrapper>
            <StyledCard>
              <span>No reports were found.</span>
            </StyledCard>
          </ContentContainerInnerWrapper>
        </ContentContainerOuterWrapper>
      );
    }

    const reportListElements = reports.map((report :Map<*, *>) => {

      const dateOccurredFormatted = moment(report.getIn([DATE_OCCURRED_FQN.toString(), 0], '')).format('YYYY-MM-DD');
      const dateReportedFormatted = moment(report.getIn([DATE_REPORTED_FQN.toString(), 0], '')).format('YYYY-MM-DD');

      return (
        <ReportDetailCard
            key={report.getIn([OPENLATTICE_ID_FQN, 0])}
            onClick={() => this.handleOnSelectReport(report)}>
          <DetailItem>
            <h2>Date Occurred</h2>
            <p>{ dateOccurredFormatted }</p>
          </DetailItem>
          <DetailItem>
            <h2>Date Reported</h2>
            <p>{ dateReportedFormatted }</p>
          </DetailItem>
          <DetailItem>
            <h2>Complaint Number</h2>
            <p>{ report.getIn([COMPLAINT_NUMBER_FQN.toString(), 0], '') }</p>
          </DetailItem>
          <DetailItem>
            <h2>Reason for Dispatch</h2>
            <p>{ report.getIn([DISPATCH_REASON_FQN.toString(), 0], '') }</p>
          </DetailItem>
          <DetailItem>
            <h2>Incident Description</h2>
            <p>{ report.getIn([INCIDENT_FQN.toString(), 0], '') }</p>
          </DetailItem>
          <DetailItem>
            <h2>Incident Location</h2>
            <p>{ report.getIn([LOCATION_OF_INCIDENT_FQN.toString(), 0], '') }</p>
          </DetailItem>
        </ReportDetailCard>
      );
    });

    return (
      <ContentContainerOuterWrapper>
        <ContentContainerInnerWrapper>
          { reportListElements }
        </ContentContainerInnerWrapper>
      </ContentContainerOuterWrapper>
    );
  }

  render() {

    const { isFetchingReports } = this.props;

    if (isFetchingReports) {
      return <Spinner />;
    }

    return (
      <Switch>
        <Route path={REPORT_VIEW_PATH} component={HackyBehavioralHealthReportViewContainer} />
        <Route render={this.renderReports} />
      </Switch>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganizationId']);

  const bhrEntitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.toString(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  return {
    entitySetIds: {
      [BEHAVIORAL_HEALTH_REPORT_FQN.toString()]: bhrEntitySetId
    },
    isFetchingReports: state.getIn(['reports', 'isFetchingReports']),
    reports: state.getIn(['reports', 'reports'], List()),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ getReportInFull, getReports }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportListContainer);
