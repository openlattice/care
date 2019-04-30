/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { Constants } from 'lattice';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../../components/spinner/Spinner';
import StyledCard from '../../components/cards/StyledCard';
import { getReports } from './ReportsActions';
import { goToPath } from '../../core/router/RoutingActions';
import { formatAsDate } from '../../utils/DateUtils';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  REPORT_ID_PARAM,
  REPORT_VIEW_PATH,
} from '../../core/router/Routes';
import {
  ContentContainerInnerWrapper,
  ContentContainerOuterWrapper,
} from '../../components/layout';

import {
  DATE_TIME_OCCURRED_FQN,
  DATE_TIME_REPORTED_FQN,
  DISPATCH_REASON_FQN,
  INCIDENT_FQN,
  LOCATION_OF_INCIDENT_FQN,
  OL_ID_FQN
} from '../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;
const {
  BEHAVIORAL_HEALTH_REPORT_FQN,
} = APP_TYPES_FQNS;

const ReportDetailCard = styled(StyledCard)`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 30px;

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
    getReports :RequestSequence;
    goToPath :(path :string) => void;
  };
  entitySetId :string;
  isFetchingReports :boolean;
  reports :List<*>;
};

class HackyReportsContainer extends Component<Props> {

  componentDidMount() {

    const { actions, entitySetId } = this.props;
    actions.getReports({ entitySetId });
  }

  handleOnClickReport = (reportEntityKeyId :string) => {

    const { actions } = this.props;
    actions.goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PARAM, reportEntityKeyId));
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

      const reportEntityKeyId :string = report.getIn([OPENLATTICE_ID_FQN, 0]);
      const dateOccurredFormatted = formatAsDate(report.getIn([DATE_TIME_OCCURRED_FQN, 0], ''));
      const dateReportedFormatted = formatAsDate(report.getIn([DATE_TIME_REPORTED_FQN, 0], ''));

      return (
        <ReportDetailCard
            id={reportEntityKeyId}
            key={reportEntityKeyId}
            onClick={() => this.handleOnClickReport(reportEntityKeyId)}>
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
            <p>{ report.getIn([OL_ID_FQN.toString(), 0], '') }</p>
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

    return this.renderReports();
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
    entitySetId: bhrEntitySetId,
    isFetchingReports: state.getIn(['reports', 'isFetchingReports']),
    reports: state.getIn(['reports', 'reports'], List()),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ getReports, goToPath }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HackyReportsContainer);
