/*
 * @flow
 */

import React from 'react';

import ConsumerSearchView from '../components/ConsumerSearchView';
  
class ConsumerSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  onSearchSubmit = () => {
    console.log('search submit!');
  }

  render () {
    return (
      <ConsumerSearchView
          onSearchSubmit={onSearchSubmit} />
    );
  }
}

export default ConsumerSearch;
