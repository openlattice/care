/*
 * @flow
 */

import React from 'react';

import Immutable, { Map } from 'immutable';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Constants } from 'lattice';
import { faAngleRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PersonSearchFields from '../../components/people/PersonSearchFields';
import Spinner from '../../components/spinner/Spinner';
import NoSearchResults from '../../components/people/NoSearchResults';
import PersonDetailsSearchResult from '../search/PersonDetailsSearchResult';
import { searchPeople, selectPerson } from './PeopleActionFactory';
import { SearchResult, SearchResultsWrapper } from '../search/SearchResultsStyledComponents';
import {
  StyledFormWrapper,
  StyledFormViewWrapper,
  StyledSectionWrapper
} from '../../components/form/StyledFormComponents';

const { OPENLATTICE_ID_FQN } = Constants;

/*
 * styled components
 */


const Wrapper = styled.div`
 display: flex;
 flex: 1 0 auto;
 flex-direction: column;
 width: 100%;
`;

const SearchResultsList = styled.div`
  background-color: #fefefe;
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  width: 100%;

  &:last-child {
    padding-bottom: 0;
  }
`;

const NonResultsContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 50px;
`;

const LoadingText = styled.div`
  font-size: 20px;
  margin: 15px;
`;

const ListSectionHeader = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  color: #555e6f;
  padding: 0 0 30px 30px;
`;

const ErrorMessage = styled.div`
  color: #ff3c5d;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  text-align: center;
`;

const PaddedSearchResult = styled(SearchResult)`
  padding: 20px;
`;

/*
 * types
 */

type Props = {
  app :Map<*, *>,
  actions :{
    searchPeople :Function,
    selectPerson :Function
  },
  isLoadingPeople :boolean,
  searchHasRun :boolean,
  searchResults :Immutable.List<Immutable.Map<*, *>>,
  error :boolean
}

class SearchPeopleContainer extends React.Component<Props> {

  static defaultProps = {
    onSelectPerson: () => {}
  }

  handleOnSelectPerson = (person :Immutable.Map) => {
    const { actions } = this.props;
    actions.selectPerson(person);
  }

  handleOnSubmitSearch = (firstName, lastName, dob) => {
    const { actions, app } = this.props;
    if (firstName.length || lastName.length || dob) {
      actions.searchPeople({
        firstName,
        lastName,
        dob,
        app
      });
    }
  }

  renderSearchResults = () => {

    const {
      actions,
      isLoadingPeople,
      searchResults,
      searchHasRun,
      error
    } = this.props;

    /* display loading spinner if necessary */
    if (isLoadingPeople) {
      return (
        <NonResultsContainer>
          <LoadingText>Loading results...</LoadingText>
          <Spinner />
        </NonResultsContainer>
      );
    }

    /* display error message if necessary */
    if (error) {
      return <NonResultsContainer><ErrorMessage>Unable to load search results.</ErrorMessage></NonResultsContainer>;
    }

    /* search has not run and is not currently running -- don't display anything */
    if (!searchHasRun) {
      return null;
    }

    /* search has finished running -- if there are no results, display the NoSearchResults component */
    if (searchResults.isEmpty()) {
      return <NonResultsContainer><NoSearchResults /></NonResultsContainer>;
    }

    return (
      <StyledFormViewWrapper>
        <StyledFormWrapper>
          <SearchResultsWrapper>
            <SearchResultsList>
              <div>
                <ListSectionHeader>People</ListSectionHeader>
                { searchResults.map(searchResult => (
                  <PaddedSearchResult
                      key={searchResult.getIn([OPENLATTICE_ID_FQN, 0])}
                      showDivider={searchResults.size > 1}
                      onClick={() => actions.selectPerson(searchResult)}>
                    <PersonDetailsSearchResult personDetails={searchResult} />
                    <FontAwesomeIcon icon={faAngleRight} size="2x" />
                  </PaddedSearchResult>
                )) }
              </div>
            </SearchResultsList>
          </SearchResultsWrapper>
        </StyledFormWrapper>
      </StyledFormViewWrapper>
    );
  }

  render() {
    return (
      <Wrapper>
        <StyledFormViewWrapper>
          <StyledFormWrapper>
            <StyledSectionWrapper>
              <PersonSearchFields handleSubmit={this.handleOnSubmitSearch} />
            </StyledSectionWrapper>
          </StyledFormWrapper>
        </StyledFormViewWrapper>
        { this.renderSearchResults() }
      </Wrapper>
    );
  }
}

function mapStateToProps(state :Immutable.Map<*, *>) :Object {
  const people = state.get('people');
  return {
    app: state.get('app', Map()),
    searchResults: people.get('peopleSearchResults', Immutable.List()),
    isLoadingPeople: people.get('isLoadingPeople', false),
    searchHasRun: people.get('searchHasRun', false)
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ searchPeople, selectPerson }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPeopleContainer);
