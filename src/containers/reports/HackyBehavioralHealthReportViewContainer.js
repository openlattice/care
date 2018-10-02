/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Button, Modal } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Match } from 'react-router';

import ComplainantInfoView from '../../components/ComplainantInfoView';
import ConsumerInfoView from '../../components/ConsumerInfoView';
import DispositionView from '../../components/DispositionView';
import OfficerInfoView from '../../components/OfficerInfoView';
import ReportInfoView from '../../components/ReportInfoView';

import Spinner from '../../components/spinner/Spinner';
import StyledCard from '../../components/cards/StyledCard';
import { deleteReport, getReportNeighbors } from './ReportsActions';
import { REPORT_EDIT_PATH, REPORT_ID_PARAM } from '../../core/router/Routes';
import { goToRoute } from '../../core/router/RoutingActions';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { isValidUuid } from '../../utils/Utils';
import {
  ContentContainerInnerWrapper,
  ContentContainerOuterWrapper,
} from '../../components/layout';
import {
  gatherComplainantData,
  gatherConsumerData,
  gatherDispositionData,
  gatherOfficerData,
  gatherReportData,
} from './HackyUtils';

const {
  BEHAVIORAL_HEALTH_REPORT_FQN,
} = APP_TYPES_FQNS;

const ActionCard = styled(StyledCard)`
  margin-bottom: 30px;
`;

const ActionButtonsWrapper = styled.div`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr 1fr;
`;

const Section = styled.div`
  margin-bottom: 60px;
`;

type Props = {
  actions :{
    deleteReport :RequestSequence;
    getReportNeighbors :RequestSequence;
    goToRoute :(route :string) => void;
  };
  entityKeyId :string;
  entitySetId :string;
  isDeletingReport :boolean;
  isFetchingReport :boolean;
  selectedOrganizationId :string;
  selectedReportData :Map<*, *>;
};

type State = {
  isDeleteModalVisible :boolean;
};

class HackyBehavioralHealthReportViewContainer extends Component<Props, State> {

  constructor(props :Props) {

    super(props);
    this.state = {
      isDeleteModalVisible: false,
    };
  }

  componentDidMount() {

    const { actions, entityKeyId, entitySetId } = this.props;
    actions.getReportNeighbors({ entityKeyId, entitySetId });
  }

  hideDeleteModal = () => {

    this.setState({ isDeleteModalVisible: false });
  }

  showDeleteModal = () => {

    this.setState({ isDeleteModalVisible: true });
  }

  handleOnClickEditReportButton = () => {

    const { actions, entityKeyId } = this.props;
    actions.goToRoute(REPORT_EDIT_PATH.replace(REPORT_ID_PARAM, entityKeyId));
  }

  deleteReport = () => {

    const { actions, entityKeyId, entitySetId } = this.props;
    actions.deleteReport({ entityKeyId, entitySetId });
  }

  renderActionCard = () => {

    return (
      <ActionCard>
        <ActionButtonsWrapper>
          <Button mode="secondary" onClick={this.showDeleteModal}>Delete</Button>
          <Button mode="primary" onClick={this.handleOnClickEditReportButton}>Edit</Button>
        </ActionButtonsWrapper>
      </ActionCard>
    );
  }

  renderReportCard = () => {

    const { selectedOrganizationId, selectedReportData } = this.props;

    // TODO: this all has to be rewritten
    return (
      <StyledCard>
        <Section>
          <ReportInfoView
              input={gatherReportData(selectedReportData)}
              isReadOnly
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
        <Section>
          <ConsumerInfoView
              input={gatherConsumerData(selectedReportData)}
              isReadOnly
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
        <Section>
          <ComplainantInfoView
              input={gatherComplainantData(selectedReportData)}
              isReadOnly
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
        <Section>
          <DispositionView
              input={gatherDispositionData(selectedReportData)}
              isReadOnly
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
        <Section>
          <OfficerInfoView
              input={gatherOfficerData(selectedReportData)}
              isReadOnly
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
      </StyledCard>
    );
  }

  renderDeleteModal = () => {

    const { isDeleteModalVisible } = this.state;
    return (
      <Modal
          isVisible={isDeleteModalVisible}
          onClose={this.hideDeleteModal}
          onClickPrimary={this.deleteReport}
          textPrimary="Delete"
          textSecondary="Cancel"
          textTitle="Delete Report">
        <p>Are you sure want to delete this report?</p>
      </Modal>
    );
  }

  render() {

    const {
      isDeletingReport,
      isFetchingReport,
    } = this.props;

    if (isFetchingReport || isDeletingReport) {
      return <Spinner />;
    }

    // TODO: this all has to be rewritten
    // TODO: still need to handle other types of reports, not just the BHR
    // TODO: Edit & View can be combined into one component

    return (
      <ContentContainerOuterWrapper>
        <ContentContainerInnerWrapper>
          { this.renderActionCard() }
          { this.renderReportCard() }
          { this.renderDeleteModal() }
        </ContentContainerInnerWrapper>
      </ContentContainerOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>, ownParams :Object) :Object {

  const match :Match = ownParams.match;
  const reportId :?string = match.params[REPORT_ID_PARAM.substr(1)];
  const entityKeyId :string = (reportId && isValidUuid(reportId)) ? reportId : '';

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganizationId']);
  const entitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.toString(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  return {
    entityKeyId,
    entitySetId,
    selectedOrganizationId,
    isDeletingReport: state.getIn(['reports', 'isDeletingReport']),
    isFetchingReport: state.getIn(['reports', 'isFetchingReport']),
    selectedReportData: state.getIn(['reports', 'selectedReportData'], Map()),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ deleteReport, getReportNeighbors, goToRoute }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HackyBehavioralHealthReportViewContainer);
