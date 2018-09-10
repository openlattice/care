import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map } from 'immutable';


import ConsumerSearchContainer from '../followup/ConsumerSearchContainer';
import ConsumerNeighborsSearchContainer from './ConsumerNeighborsSearchContainer';
import ConsumerReportList from './ConsumerReportList';
import BHRSummaryContainer from './BHRSummaryContainer';
import {
  PAGE_1,
  PAGE_2,
  PAGE_3
} from './ConsumerSummaryConstants';
import StyledCard from '../../components/cards/StyledCard';
import { ContainerInnerWrapper, ContainerOuterWrapper } from '../../shared/Layout';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getBHRReport } from './ConsumerSummaryActionFactory';
import { REQUEST_STATUSES } from './ConsumerSummaryReducer';

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;


class ConsumerSummaryContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedConsumer: Map(),
      selectedReport: Map()
    };
  }

  handleOnSelectConsumerSearchResult = (searchResult) => {
    this.setState(
      {
        selectedConsumer: searchResult
      },
      () => {
        this.props.history.push(PAGE_2);
      }
    );
  }

  handleOnSelectReport = (report) => {
    this.setState(
      {
        selectedReport: report
      },
      () => {
        this.props.history.push(PAGE_3);
      }
    );
  }

  renderSearchContainer = () => (
    <ContainerOuterWrapper>
      <ContainerInnerWrapper>
        <StyledCard>
          <ConsumerSearchContainer
              peopleEntitySetId={this.props.entitySetIds[PEOPLE_FQN.getFullyQualifiedName()]}
              onSelectSearchResult={this.handleOnSelectConsumerSearchResult} />
        </StyledCard>
      </ContainerInnerWrapper>
    </ContainerOuterWrapper>
  )

  renderConsumerReportList = () => (
    <ConsumerNeighborsSearchContainer
        consumer={this.state.selectedConsumer}
        peopleEntitySetId={this.props.entitySetIds[PEOPLE_FQN.getFullyQualifiedName()]}
        onSelectSearchResult={this.handleOnSelectReport} />
  )

  renderReportSummary = () => {

    return (
      <BHRSummaryContainer selectedReport={this.state.selectedReport} />
    );
  }

  render() {
    return (
      <Switch>
        <Route path={PAGE_1} render={this.renderSearchContainer} />
        <Route path={PAGE_2} render={this.renderConsumerReportList} />
        <Route path={PAGE_3} render={this.renderReportSummary} />
        <Redirect to={PAGE_1} />
      </Switch>
    );
  }
}


// Remove unused props and actions
function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganization']);

  const appearsInEntitySetId :string = state.getIn([
    'app',
    APPEARS_IN_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  const peopleEntitySetId :string = state.getIn([
    'app',
    PEOPLE_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  const reportEntitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  const submissionState :number = state.getIn([
    'consumerSummary',
    'submissionState'
  ]);

  const formData = state.getIn([
    'consumerSummary',
    'formData'
  ]);

  return {
    selectedOrganizationId,
    app: state.get('app', Map()),
    entitySetIds: {
      [APPEARS_IN_FQN.getFullyQualifiedName()]: appearsInEntitySetId,
      [PEOPLE_FQN.getFullyQualifiedName()]: peopleEntitySetId,
      [BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName()]: reportEntitySetId
    }
  };
}

export default withRouter(
  connect(mapStateToProps)(ConsumerSummaryContainer)
);
