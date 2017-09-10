/*
 * @flow
 */

import React from 'react';
import { SearchApi } from 'lattice';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import FormNav from '../components/FormNav';
import { SectionHeader } from '../shared/Layout';
import { FORM_PATHS } from '../shared/Consts';

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
      resultsPage: 1,
      didSearch: false
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
        this.setState({ 
          results: results.hits,
          didSearch: true
        });
      });
    }
  }

  render () {
    return (
      <div>
        <SectionHeader>Select Consumer</SectionHeader>
        <StyledButton onClick={() => this.props.handlePageChange(FORM_PATHS.CONSUMER)} block>Create New Consumer Entry</StyledButton>
        <DividerStatement>—OR—</DividerStatement>
        <SearchBar handleInput={this.handleInput} query={this.state.query} onSearchSubmit={this.onSearchSubmit} />
        <SearchResults results={this.state.results} handlePersonSelection={this.props.handlePersonSelection} didSearch={this.state.didSearch} />
      </div>
    );
  }
}

export default ConsumerSearch;
