/*
 * @flow
 */

import React from 'react';
import { SearchApi } from 'lattice';

import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

const MAX_HITS = 10;

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
        <SearchBar handleInput={this.handleInput} query={this.state.query} onSearchSubmit={this.onSearchSubmit} />
        <SearchResults results={this.state.results} onPersonSelection={this.props.handlePersonSelection} />
      </div>
    );
  }
}

export default ConsumerSearch;
