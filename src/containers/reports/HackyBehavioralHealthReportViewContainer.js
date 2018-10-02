/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Button, Modal } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import ComplainantInfoView from '../../components/ComplainantInfoView';
import ConsumerInfoView from '../../components/ConsumerInfoView';
import DispositionView from '../../components/DispositionView';
import OfficerInfoView from '../../components/OfficerInfoView';
import ReportInfoView from '../../components/ReportInfoView';

import Spinner from '../../components/spinner/Spinner';
import StyledCard from '../../components/cards/StyledCard';
import { deleteReport, getReports } from './ReportsActions';
import { REPORT_EDIT_PATH, REPORTS_PATH } from '../../core/router/Routes';
import { goToRoute } from '../../core/router/RoutingActions';
import { APP_TYPES_FQNS } from '../../shared/Consts';
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
    getReportInFull :RequestSequence;
    goToRoute :(route :string) => void;
  };
  entitySetId :string;
  isDeletingReport :boolean;
  isFetchingReportInFull :boolean;
  selectedOrganizationId :string;
  selectedReportData :Map<*, *>;
  selectedReportEntityKeyId :string;
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

  showDeleteModal = () => {

    this.setState({ isDeleteModalVisible: true });
  }

  handleOnClickEditReportButton = () => {

    const { actions } = this.props;
    actions.goToRoute(REPORT_EDIT_PATH);
  }

  handleOnCloseModal = () => {

    this.setState({ isDeleteModalVisible: false });
  }

  deleteReport = () => {

    const { actions, entitySetId, selectedReportEntityKeyId } = this.props;
    actions.deleteReport({
      entitySetId,
      entityKeyId: selectedReportEntityKeyId,
    });
  }

  renderActionCard = () => {

    return (
      <ActionCard>
        <ActionButtonsWrapper>
          <Button onClick={this.showDeleteModal}>Delete</Button>
          <Button mode="secondary" onClick={this.handleOnClickEditReportButton}>Edit</Button>
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
          onClose={this.handleOnCloseModal}
          onClickPrimary={this.deleteReport}
          textPrimary="Delete"
          textSecondary="Cancel"
          textTitle="Delete Report">
        <p>Are you sure want to delete this report?</p>
      </Modal>
    );
  }

  render() {

    const { isDeletingReport, isFetchingReportInFull, selectedReportEntityKeyId } = this.props;
    if (isFetchingReportInFull || isDeletingReport) {
      return <Spinner />;
    }

    if (!selectedReportEntityKeyId) {
      return <Redirect to={REPORTS_PATH} />;
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

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganizationId']);
  const entitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.toString(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  return {
    entitySetId,
    selectedOrganizationId,
    isDeletingReport: state.getIn(['reports', 'isDeletingReport']),
    isFetchingReportInFull: state.getIn(['reports', 'isFetchingReportInFull']),
    selectedReportData: state.getIn(['reports', 'selectedReportData'], Map()),
    selectedReportEntityKeyId: state.getIn(['reports', 'selectedReportEntityKeyId'], ''),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ deleteReport, goToRoute, getReports }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HackyBehavioralHealthReportViewContainer);
