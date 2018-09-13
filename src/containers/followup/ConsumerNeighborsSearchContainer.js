/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { randomId } from '../../utils/Utils';

import Loading from '../../components/Loading';
import StyledCard from '../../components/cards/StyledCard';
import ReportSearchResult from '../search/ReportSearchResult';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { ContainerInnerWrapper, ContainerOuterWrapper } from '../../shared/Layout';
import { SearchResultsWrapper } from '../search/SearchResultsStyledComponents';

import {
  clearConsumerNeighborsSearchResults,
  searchConsumerNeighbors
} from '../search/SearchActionFactory';

const {
  BEHAVIORAL_HEALTH_REPORT_FQN
} = APP_TYPES_FQNS;

/*
 * styled components
 */


const Title = styled.span`
  font-size: 22px;
  font-weight: normal;
  padding: 0;
  margin: 0;
`;

/*
 * types
 */

type Props = {
  actions :{
    clearConsumerNeighborsSearchResults :Function;
    searchConsumerNeighbors :RequestSequence;
  };
  bhrEntitySetId :string;
  consumer :Map<*, *>;
  history :RouterHistory;
  isSearching :boolean;
  peopleEntitySetId :string;
  searchResults :List<*>;
  onSelectSearchResult :Function;
};

type State = {};

class ConsumerNeighborsSearchContainer extends React.Component<Props, State> {

  componentWillMount() {

    this.props.actions.searchConsumerNeighbors({
      entitySetId: this.props.peopleEntitySetId,
      entityId: this.props.consumer.getIn(['id', 0])
    });
  }

  componentWillUnmount() {

    this.props.actions.clearConsumerNeighborsSearchResults();
  }

  renderSearchResults = () => {

    if (!this.props.searchResults || this.props.searchResults.isEmpty()) {
      return (
        <SearchResultsWrapper>
          <div>No Behavioral Health Reports were found for the selected consumer. Please try again.</div>
        </SearchResultsWrapper>
      );
    }

    /*
     *
     * TODO: how do we avoid hardcoding FQNs?
     *
     */

    const searchResults = [];
    const showDivider :boolean = this.props.searchResults.size > 1;
    this.props.searchResults
      .filter((searchResults :Map<*, *>) => {
        // include only BHR results
        return searchResults.getIn(['neighborEntitySet', 'id']) === this.props.bhrEntitySetId;
      })
      .forEach((searchResult :Map<*, *>) => {
        const searchResultNeighborDetails = searchResult.get('neighborDetails');

        searchResults.push(
          <ReportSearchResult
              searchResult={searchResultNeighborDetails}
              onSelectSearchResult={this.props.onSelectSearchResult}
              showDivider={showDivider}
              key={randomId()} />
        );
      });

    return (
      <SearchResultsWrapper>
        { searchResults }
      </SearchResultsWrapper>
    );
  }

  render() {

    if (this.props.isSearching) {
      return <Loading />;
    }

    return (
      <ContainerOuterWrapper>
        <ContainerInnerWrapper>
          <StyledCard>
            <Title>Choose BHR to follow up on</Title>
            { this.renderSearchResults() }
          </StyledCard>
        </ContainerInnerWrapper>
      </ContainerOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganization']);

  const bhrEntitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  return {
    bhrEntitySetId,
    isSearching: state.getIn(['search', 'consumerNeighbors', 'isSearching'], false),
    searchResults: state.getIn(['search', 'consumerNeighbors', 'searchResults'], List())
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    clearConsumerNeighborsSearchResults,
    searchConsumerNeighbors
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ConsumerNeighborsSearchContainer)
);
