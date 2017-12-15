/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import ConsumerSearchContainer from './ConsumerSearchContainer';
import ConsumerNeighborsSearchContainer from './ConsumerNeighborsSearchContainer';
import FollowUpReportContainer from './FollowUpReportContainer';

import * as Routes from '../../core/router/Routes';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import { submitFollowUpReport } from './FollowUpReportActionFactory';

const {
  APPEARS_IN_FQN,
  FOLLOW_UP_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

/*
 * constants
 */

const PAGE_1 :string = `${Routes.FOLLOW_UP_PATH}/1`;
const PAGE_2 :string = `${Routes.FOLLOW_UP_PATH}/2`;
const PAGE_3 :string = `${Routes.FOLLOW_UP_PATH}/3`;

/*
 * types
 */

type Props = {
  actions :{
    submitFollowUpReport :RequestSequence;
  };
  app :Map<*, *>;
  entitySetIds :{[key :string] :string};
  history :RouterHistory;
  selectedOrganizationId :string;
};

type State = {
  selectedConsumer :Map<*, *>;
  selectedConsumerNeighbor :Map<*, *>;
};

class FollowUpReportManager extends React.Component<Props, State> {

  constructor(props :Props) {

    super(props);

    this.state = {
      selectedConsumer: Immutable.Map(),
      selectedConsumerNeighbor: Immutable.Map()
    };
  }

  handleOnCancel = () => {

    this.props.history.push(PAGE_1);
  }

  handleOnSelectConsumerSearchResult = (searchResult :Map<*, *>) => {

    // TODO: routing between pages needs more thought
    this.setState(
      {
        selectedConsumer: searchResult
      },
      () => {
        this.props.history.push(PAGE_2);
      }
    );
  }

  handleOnSelectConsumerNeighborSearchResult = (searchResult :Map<*, *>) => {

    // TODO: routing between pages needs more thought
    this.setState(
      {
        selectedConsumerNeighbor: searchResult
      },
      () => {
        this.props.history.push(PAGE_3);
      }
    );
  }

  handleOnSubmit = (reportValues :Object) => {

    // TODO: error handling

    this.props.actions.submitFollowUpReport({
      app: this.props.app,
      consumer: this.state.selectedConsumer,
      neighbor: this.state.selectedConsumerNeighbor,
      reportInfo: reportValues
    });
  }

  renderConsumerSearchContainer = () => {

    return (
      <ConsumerSearchContainer
          peopleEntitySetId={this.props.entitySetIds[PEOPLE_FQN.getFullyQualifiedName()]}
          onSelectSearchResult={this.handleOnSelectConsumerSearchResult} />
    );
  }

  renderConsumerNeighborsSearchContainer = () => {

    const { selectedConsumer } = this.state;

    if (!selectedConsumer || selectedConsumer.isEmpty()) {
      // TODO: routing between pages needs more thought
      return (
        <Redirect to={PAGE_1} />
      );
    }

    return (
      <ConsumerNeighborsSearchContainer
          consumer={this.state.selectedConsumer}
          peopleEntitySetId={this.props.entitySetIds[PEOPLE_FQN.getFullyQualifiedName()]}
          onSelectSearchResult={this.handleOnSelectConsumerNeighborSearchResult} />
    );
  }

  renderFollowUpReportContainer = () => {

    const { selectedConsumer, selectedConsumerNeighbor } = this.state;

    if (
      !selectedConsumer
      || selectedConsumer.isEmpty()
      || !selectedConsumerNeighbor
      || selectedConsumerNeighbor.isEmpty()
    ) {
      // TODO: routing between pages needs more thought
      return (
        <Redirect to={PAGE_1} />
      );
    }

    return (
      <FollowUpReportContainer
          consumer={this.state.selectedConsumer}
          consumerNeighbor={this.state.selectedConsumerNeighbor}
          peopleEntitySetId={this.props.entitySetIds[PEOPLE_FQN.getFullyQualifiedName()]}
          onCancel={this.handleOnCancel}
          onSubmit={this.handleOnSubmit} />
    );
  }

  render() {

    return (
      <Switch>
        <Route path={PAGE_1} render={this.renderConsumerSearchContainer} />
        <Route path={PAGE_2} render={this.renderConsumerNeighborsSearchContainer} />
        <Route path={PAGE_3} component={this.renderFollowUpReportContainer} />
        <Redirect to={PAGE_1} />
      </Switch>
    );
  }
}

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
    FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  return {
    selectedOrganizationId,
    app: state.get('app', Immutable.Map()),
    entitySetIds: {
      [APPEARS_IN_FQN.getFullyQualifiedName()]: appearsInEntitySetId,
      [PEOPLE_FQN.getFullyQualifiedName()]: peopleEntitySetId,
      [FOLLOW_UP_REPORT_FQN.getFullyQualifiedName()]: reportEntitySetId
    }
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ submitFollowUpReport }, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FollowUpReportManager)
);
