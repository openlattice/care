/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { faAngleRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import Spinner from '../../components/spinner/Spinner';
import SearchInput from '../../components/SearchInput';
import PersonDetailsSearchResult from '../search/PersonDetailsSearchResult';
import { SearchResult, SearchResultsWrapper } from '../search/SearchResultsStyledComponents';

import {
  clearConsumerSearchResults,
  searchConsumers
} from '../search/SearchActionFactory';

const { OPENLATTICE_ID_FQN } = Constants;
/*
 * styled components
 */

// HACK
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.span`
  font-size: 22px;
  font-weight: normal;
  padding: 0;
  margin: 0;
`;

const FullWidthSearchInput = styled(SearchInput)`
  width: 100%;
`;

const NoSearchResults = styled.div`
  font-weight: bold;
  text-align: center;
`;

/*
 * types
 */

type Props = {
  actions :{
    clearConsumerSearchResults :Function;
    searchConsumers :RequestSequence;
  };
  isSearching :boolean;
  peopleEntitySetId :string;
  searchResults :List<*>;
  showTitle :boolean;
  onSelectSearchResult :Function;
};

type State = {
  searchAttempt :boolean;
  searchQuery :string;
};

class ConsumerSearchContainer extends React.Component<Props, State> {

  static defaultProps = {
    showTitle: true
  };

  constructor(props :Props) {

    super(props);

    this.state = {
      searchAttempt: false,
      searchQuery: ''
    };
  }

  componentWillUnmount() {

    this.props.actions.clearConsumerSearchResults();
  }

  handleOnChangeConsumerSearchQuery = (value :string) => {

    this.setState({
      searchQuery: value
    });
  }

  handleOnSubmitConsumerSearch = () => {

    this.setState({
      searchAttempt: true
    });

    this.props.actions.searchConsumers({
      entitySetId: this.props.peopleEntitySetId,
      query: this.state.searchQuery
    });
  }

  renderSearchResults = () => {

    if (!this.state.searchAttempt) {
      return null;
    }

    const searchResults = [];
    if (this.props.searchResults.size > 0) {
      const showDivider :boolean = this.props.searchResults.size > 1;
      this.props.searchResults.forEach((searchResult :Map<*, *>) => {
        searchResults.push(
          <SearchResult
              key={searchResult.getIn([OPENLATTICE_ID_FQN, 0])}
              showDivider={showDivider}
              onClick={() => this.props.onSelectSearchResult(searchResult)}>
            <PersonDetailsSearchResult personDetails={searchResult} />
            <FontAwesomeIcon icon={faAngleRight} size="2x" />
          </SearchResult>
        );
      });
    }

    return (
      <SearchResultsWrapper>
        {
          (this.props.isSearching)
            ? <Spinner />
            : null
        }
        {
          (!this.props.isSearching && searchResults.length === 0)
            ? <NoSearchResults>No results</NoSearchResults>
            : searchResults
        }
      </SearchResultsWrapper>
    );
  }

  render() {

    return (
      <Wrapper>
        {
          this.props.showTitle
            ? <Title>Search for existing consumers</Title>
            : null
        }
        <FullWidthSearchInput
            placeholder="Search..."
            onChange={this.handleOnChangeConsumerSearchQuery}
            onSubmit={this.handleOnSubmitConsumerSearch} />
        { this.renderSearchResults() }
      </Wrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    isSearching: state.getIn(['search', 'consumers', 'isSearching'], false),
    searchResults: state.getIn(['search', 'consumers', 'searchResults'], List())
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    clearConsumerSearchResults,
    searchConsumers
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ConsumerSearchContainer)
);
