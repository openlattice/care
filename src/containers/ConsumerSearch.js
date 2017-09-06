/*
 * @flow
 */

import React from 'react';
import { SearchApi } from 'lattice';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

const MAX_HITS = 10;

const StyledButton = styled(Button)`
  margin-bottom: 20px;
`;

const DividerStatement = styled.div`
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
`;

class ConsumerSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      results: [],
      resultsPage: 1
    }
  }

  handleInput = (e) => {
    this.setState({ query: e.target.value });
  }

  onSearchSubmit = (e) => {
    e.preventDefault();
    const searchRequest = {
      searchTerm: this.state.query,
      start: ((this.state.resultsPage - 1) * MAX_HITS),
      maxHits: MAX_HITS
    };

    if (this.props.personEntitySetId.length > 0) {
      SearchApi.searchEntitySetData(this.props.personEntitySetId, searchRequest)
      .then((results) => {
        console.log('got search results!:', results);
        this.setState({ results: results.hits });
      });
    }

  }

  executeSearch = (searchTerm, page) => {
    const searchRequest = {
      searchTerm,
      start: ((page - 1) * MAX_HITS),
      maxHits: MAX_HITS
    };
    SearchApi.searchEntitySetData(this.props.params.entitySetId, searchRequest)
    .then((response) => {
      this.setState({
        searchResults: response.hits,
        totalHits: response.numHits,
        asyncStatus: ASYNC_STATUS.SUCCESS
      });
    }).catch(() => {
      this.setState({ asyncStatus: ASYNC_STATUS.ERROR });
    });
  }

  render () {
    return (
      <div>
        <StyledButton onClick={() => this.props.handlePageChange('next')} block>Create New Consumer Entry</StyledButton>
        <DividerStatement>—OR—</DividerStatement>
        <SearchBar handleInput={this.handleInput} query={this.state.query} onSearchSubmit={this.onSearchSubmit} />
        <SearchResults results={this.state.results} handlePersonSelection={this.props.handlePersonSelection} />
      </div>
    );
  }
}

export default ConsumerSearch;
