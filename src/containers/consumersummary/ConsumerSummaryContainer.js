import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map } from 'immutable';


import ConsumerSearchContainer from '../followup/ConsumerSearchContainer';
import ConsumerNeighborsSearchContainer from './ConsumerNeighborsSearchContainer';
import ConsumerReportList from './ConsumerReportList';
import ReviewView from '../../components/ReviewView';
import {
  PAGE_1,
  PAGE_2,
  PAGE_3
} from './ConsumerSummaryConstants';
import StyledCard from '../../components/cards/StyledCard';
import { ContainerInnerWrapper, ContainerOuterWrapper } from '../../shared/Layout';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const {
  APPEARS_IN_FQN,
  FOLLOW_UP_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

// props needed: entitysetIds, handleOnSelectConsumerSearchResult
class ConsumerSummaryContainer extends React.Component {
  constructor(props) {
    super(props);

    // why maps?
    this.state = {
      selectedConsumer: Map(),
      selectedReport: Map()
    };
  }

  handleOnSelectConsumerSearchResult = (searchResult) => {
    // first get reports for selected consumer, then set state and go to page 2
    // ...

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
    // first get report form values, then set state and go to page 3
    // ...

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

  renderConsumerReportList = () => {
    // pass report info
    const dummyReports = ['one', 'two', 'three'];
    // return (
    //   <ConsumerReportList reports={dummyReports} handleOnSelectReport={this.handleOnSelectReport} />
    // );

    return (
      <ConsumerNeighborsSearchContainer
          consumer={this.state.selectedConsumer}
          peopleEntitySetId={this.props.entitySetIds[PEOPLE_FQN.getFullyQualifiedName()]}
          onSelectSearchResult={this.handleOnSelectReport} />
    );
  }

  renderReportSummary = () => {
    // given report values, render summary view.

    return (
      <ReviewView
          complainantInfo={report.complainantInfo}
          consumerInfo={report.consumerInfo}
          dispositionInfo={report.dispositionInfo}
          officerInfo={report.officerInfo}
          reportInfo={report.reportInfo}
          selectedOrganizationId={this.props.selectedOrganizationId}
          isInReview={true} />
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
    FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  return {
    selectedOrganizationId,
    app: state.get('app', Map()),
    entitySetIds: {
      [APPEARS_IN_FQN.getFullyQualifiedName()]: appearsInEntitySetId,
      [PEOPLE_FQN.getFullyQualifiedName()]: peopleEntitySetId,
      [FOLLOW_UP_REPORT_FQN.getFullyQualifiedName()]: reportEntitySetId
    }
  };
}

export default withRouter(
  connect(mapStateToProps)(ConsumerSummaryContainer)
);
