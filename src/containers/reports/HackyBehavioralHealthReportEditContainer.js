/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { List, Map, Set } from 'immutable';
import { Models } from 'lattice';
import { Button } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import ComplainantInfoView from '../../components/ComplainantInfoView';
import ConsumerInfoView from '../../components/ConsumerInfoView';
import DispositionView from '../../components/DispositionView';
import OfficerInfoView from '../../components/OfficerInfoView';
import ReportInfoView from '../../components/ReportInfoView';

import StyledCard from '../../components/cards/StyledCard';
import { submitReportEdits } from './ReportsActions';
import { goToRoute } from '../../core/router/RoutingActions';
import { REPORTS_PATH, REPORT_VIEW_PATH } from '../../core/router/Routes';
import { APP_TYPES_FQNS } from '../../shared/Consts';
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
    submitReportEdits :RequestSequence;
  };
  edm :Map<*, *>;
  entitySetId :string;
  selectedOrganizationId :string;
  selectedReportData :Map<*, *>;
  selectedReportEntityKeyId :string;
};

type State = {
  reportEdits :Map<FullyQualifiedName, Set<any>>;
};

class HackyBehavioralHealthReportEditContainer extends Component<Props, State> {

  constructor(props :Props) {

    super(props);
    this.state = {
      reportEdits: Map(),
    };
  }

  handleOnClickDiscard = () => {

    const { actions } = this.props;
    actions.goToRoute(REPORT_VIEW_PATH);
  }

  handleOnClickUpdate = () => {

    const {
      actions,
      edm,
      entitySetId,
      selectedReportEntityKeyId
    } = this.props;
    const { reportEdits } = this.state;

    const entityData :Map<string, Set<any>> = Map().withMutations((map :Map<string, Set<any>>) => {
      reportEdits.forEach((value :Set<any>, fqn :FullyQualifiedName) => {
        const id :string = edm.getIn(['fqnToIdMap', fqn]);
        map.setIn([selectedReportEntityKeyId, id], value);
      });
    });

    actions.submitReportEdits({
      entityData,
      entitySetId,
    });
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
          <Button onClick={this.handleOnClickUpdate}>Update</Button>
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

  render() {

    const { selectedReportData, selectedReportEntityKeyId } = this.props;
    if (!selectedReportEntityKeyId || !selectedReportData || selectedReportData.isEmpty()) {
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
    edm: state.get('edm'),
    selectedReportData: state.getIn(['reports', 'selectedReportData'], Map()),
    selectedReportEntityKeyId: state.getIn(['reports', 'selectedReportEntityKeyId'], ''),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ goToRoute, submitReportEdits }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HackyBehavioralHealthReportEditContainer);
