/*
 * @flow
 */

import React from 'react';

import ConsumerSearchView from '../components/ConsumerSearchView';
  
class ConsumerSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      person: {},
      personIsSelected: false
    }
  }

  handleInput = (e) => {
    this.setState({ query: e.target.value });
  }

  onSearchSubmit = (e) => {
    e.preventDefault();
    console.log('search submit!', this.state.query);
  }

  onPersonSelection = () => {
    // set person
    // set personIsSelected -> on autopopulation, make fields uneditable
    // increment page
  }

  render () {
    return (
      <ConsumerSearchView handleInput={this.handleInput} query={this.state.query} onSearchSubmit={this.onSearchSubmit} />
    );
  }
}

export default ConsumerSearch;
