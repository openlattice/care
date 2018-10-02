/*
 * @flow
 */

import React from 'react';

import styled, { css } from 'styled-components';
import { faAngleRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import Spinner from '../../components/spinner/Spinner';
import StyledCard from '../../components/cards/StyledCard';
import { APP_TYPES_FQNS } from '../../shared/Consts';

import { SearchResult, SearchResultsWrapper } from '../search/SearchResultsStyledComponents';
import {
  ContentContainerInnerWrapper,
  ContentContainerOuterWrapper,
} from '../../components/layout';

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

const BHRDetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  &:hover {
    cursor: pointer;
  }
`;

const BHRDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) => {
    if (props.scStyles && props.scStyles.width) {
      return css`
        flex: 0 0 auto;
        width: ${props.scStyles.width};
      `;
    }
    return css`
      flex: 1;
    `;
  }}
  strong {
    font-weight: bold;
  }
`;

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
  isSearching :boolean;
  peopleEntitySetId :string;
  searchResults :List<*>;
  onSelectSearchResult :Function;
};

type State = {};

class ConsumerNeighborsSearchContainer extends React.Component<Props, State> {

  componentWillMount() {

    const { actions, consumer, peopleEntitySetId } = this.props;
    actions.searchConsumerNeighbors({
      entitySetId: peopleEntitySetId,
      entityId: consumer.getIn(['id', 0])
    });
  }

  componentWillUnmount() {

    const { actions } = this.props;
    actions.clearConsumerNeighborsSearchResults();
  }

  renderSearchResults = () => {

    const { bhrEntitySetId, onSelectSearchResult, searchResults } = this.props;
    if (!searchResults || searchResults.isEmpty()) {
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

    const elements = [];
    const showDivider :boolean = searchResults.size > 1;
    searchResults
      .filter((searchResult :Map<*, *>) => {
        // include only BHR results
        return searchResult.getIn(['neighborEntitySet', 'id']) === bhrEntitySetId;
      })
      .forEach((searchResult :Map<*, *>) => {
        elements.push(
          <SearchResult
              key={searchResult.get('neighborId')}
              showDivider={showDivider}
              onClick={() => onSelectSearchResult(searchResult)}>
            <BHRDetailsRow>
              <BHRDetailItem scStyles={{ width: '150px' }}>
                <strong>Date Occurred</strong>
                <span>{ searchResult.getIn(['neighborDetails', 'bhr.dateOccurred', 0], '') }</span>
              </BHRDetailItem>
              <BHRDetailItem scStyles={{ width: '150px' }}>
                <strong>Date Reported</strong>
                <span>{ searchResult.getIn(['neighborDetails', 'bhr.dateReported', 0], '') }</span>
              </BHRDetailItem>
              <BHRDetailItem scStyles={{ width: '150px' }}>
                <strong>Complaint Number</strong>
                <span>{ searchResult.getIn(['neighborDetails', 'bhr.complaintNumber', 0], '') }</span>
              </BHRDetailItem>
              <BHRDetailItem>
                <strong>Incident</strong>
                <span>{ searchResult.getIn(['neighborDetails', 'bhr.incident', 0], '') }</span>
              </BHRDetailItem>
            </BHRDetailsRow>
            <FontAwesomeIcon icon={faAngleRight} size="2x" />
          </SearchResult>
        );
      });

    return (
      <SearchResultsWrapper>
        { elements }
      </SearchResultsWrapper>
    );
  }

  render() {

    const { isSearching } = this.props;
    if (isSearching) {
      return <Spinner />;
    }

    return (
      <ContentContainerOuterWrapper>
        <ContentContainerInnerWrapper>
          <StyledCard>
            <Title>Choose BHR to follow up on</Title>
            { this.renderSearchResults() }
          </StyledCard>
        </ContentContainerInnerWrapper>
      </ContentContainerOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganizationId']);

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
