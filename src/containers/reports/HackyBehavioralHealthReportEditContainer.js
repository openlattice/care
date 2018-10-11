/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { List, Map, Set } from 'immutable';
import { Models } from 'lattice';
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
import { updateReport } from './ReportsActions';
import { goToRoute } from '../../core/router/RoutingActions';
import { REPORT_VIEW_PATH, REPORT_ID_PARAM } from '../../core/router/Routes';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { isValidUuid } from '../../utils/Utils';
import {
  gatherComplainantData,
  gatherConsumerData,
  gatherDispositionData,
  gatherOfficerData,
  gatherReportData,
} from './HackyUtils';
import {
  ContentContainerInnerWrapper,
  ContentContainerOuterWrapper,
} from '../../components/layout';

const { FullyQualifiedName } = Models;
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
    goToRoute :(route :string) => void;
    updateReport :RequestSequence;
  };
  entityKeyId :string;
  entitySetId :string;
  isUpdatingReport :boolean;
  selectedOrganizationId :string;
  selectedReportData :Map<*, *>;
};

type State = {
  reportEdits :Map<FullyQualifiedName, Set<any>>;
  isUpdateModalVisible :boolean;
};

class HackyBehavioralHealthReportEditContainer extends Component<Props, State> {

  constructor(props :Props) {

    super(props);
    this.state = {
      isUpdateModalVisible: false,
      reportEdits: Map(),
    };
  }

  componentDidUpdate(prevProps) {

    const { isUpdatingReport } = this.props;
    if (prevProps.isUpdatingReport === true && isUpdatingReport === false) {
      // TODO: we still need to somehow indicate to the user if the update succeeded
      // it's safe to hide the modal since we went from updating to not updating
      this.setState({
        isUpdateModalVisible: false,
        reportEdits: Map(),
      });
    }
  }

  hideUpdateModal = () => {

    this.setState({ isUpdateModalVisible: false });
  }

  showUpdateModal = () => {

    this.setState({ isUpdateModalVisible: true });
  }

  handleOnClickDiscard = () => {

    const { actions, entityKeyId } = this.props;
    actions.goToRoute(REPORT_VIEW_PATH.replace(REPORT_ID_PARAM, entityKeyId));
  }

  updateReport = () => {

    const { actions, entityKeyId, entitySetId } = this.props;
    const { reportEdits } = this.state;
    actions.updateReport({ entityKeyId, entitySetId, reportEdits });
  }

  updateStateValue = (section :string, key :FullyQualifiedName, value :any) => {

    let { reportEdits } = this.state;
    const keyFqn :FullyQualifiedName = new FullyQualifiedName(key);
    if (Array.isArray(value)) {
      reportEdits = reportEdits.set(keyFqn, List(value));
    }
    else {
      reportEdits = reportEdits.set(keyFqn, List([value]));
    }
    this.setState({ reportEdits });
  }

  updateStateValues = (section :string, values :Object) => {

    let { reportEdits } = this.state;
    Object.keys(values).forEach((key :string) => {
      const value :any = values[key];
      const keyFqn :FullyQualifiedName = new FullyQualifiedName(key);
      if (Array.isArray(value)) {
        reportEdits = reportEdits.set(keyFqn, List(value));
      }
      else {
        reportEdits = reportEdits.set(keyFqn, List([value]));
      }
    });
    this.setState({ reportEdits });
  }

  renderActionCard = () => {

    return (
      <ActionCard>
        <ActionButtonsWrapper>
          <Button mode="secondary" onClick={this.handleOnClickDiscard}>Discard Changes</Button>
          <Button mode="primary" onClick={this.showUpdateModal}>Update</Button>
        </ActionButtonsWrapper>
      </ActionCard>
    );
  }

  renderReportCard = () => {

    const { selectedOrganizationId, selectedReportData } = this.props;
    const { reportEdits } = this.state;

    // not fully confident in the merge()
    const edits :Map<*, *> = selectedReportData.merge(reportEdits);

    // TODO: this all has to be rewritten
    return (
      <StyledCard>
        <Section>
          <ReportInfoView
              input={gatherReportData(edits)}
              selectedOrganizationId={selectedOrganizationId}
              updateStateValue={this.updateStateValue}
              updateStateValues={this.updateStateValues} />
        </Section>
        <Section>
          <ConsumerInfoView
              consumerIsSelected
              input={gatherConsumerData(edits)}
              selectedOrganizationId={selectedOrganizationId}
              updateStateValue={this.updateStateValue}
              updateStateValues={this.updateStateValues} />
        </Section>
        <Section>
          <ComplainantInfoView
              input={gatherComplainantData(edits)}
              selectedOrganizationId={selectedOrganizationId}
              updateStateValue={this.updateStateValue}
              updateStateValues={this.updateStateValues} />
        </Section>
        <Section>
          <DispositionView
              input={gatherDispositionData(edits)}
              selectedOrganizationId={selectedOrganizationId}
              updateStateValue={this.updateStateValue}
              updateStateValues={this.updateStateValues} />
        </Section>
        <Section>
          <OfficerInfoView
              input={gatherOfficerData(edits)}
              selectedOrganizationId={selectedOrganizationId}
              updateStateValue={this.updateStateValue}
              updateStateValues={this.updateStateValues} />
        </Section>
      </StyledCard>
    );
  }

  renderUpdateModal = () => {

    const { isUpdateModalVisible } = this.state;
    return (
      <Modal
          isVisible={isUpdateModalVisible}
          onClose={this.hideUpdateModal}
          onClickPrimary={this.updateReport}
          textPrimary="Update"
          textSecondary="Cancel"
          textTitle="Update Report">
        <p>Are you sure want to save these changes?</p>
      </Modal>
    );
  }

  render() {

    const { isUpdatingReport } = this.props;
    if (isUpdatingReport) {
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
          { this.renderUpdateModal() }
        </ContentContainerInnerWrapper>
      </ContentContainerOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>, ownProps :Object) :Object {

  const match :Match = ownProps.match;
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
    isUpdatingReport: state.getIn(['reports', 'isUpdatingReport']),
    selectedReportData: state.getIn(['reports', 'selectedReportData'], Map()),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ goToRoute, updateReport }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HackyBehavioralHealthReportEditContainer);
