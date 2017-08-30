/*
 * @flow
 */

import React from 'react';
import { Button } from 'react-bootstrap';

import SearchBar from './SearchBar';

const ConsumerSearchView = ({ handleInput, query, onSearchSubmit }) => {
  return (
    <div>
      <SearchBar handleInput={handleInput} query={query} onSearchSubmit={onSearchSubmit} />
    </div>
  );
}

export default ConsumerSearchView;
