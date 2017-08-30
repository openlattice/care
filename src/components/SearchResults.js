/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

import PersonRow from './PersonRow';

const SearchResults = ({ results, onPersonSelection }) => {
  const renderResults = () => {
    const firstNameFqn = 'nc.PersonGivenName';
    const lastNameFqn = 'nc.PersonSurName';
    const resultRows = [];
    results.forEach((result) => {
      if (result[firstNameFqn] && result[firstNameFqn][0].length > 1 && result[lastNameFqn] && result[lastNameFqn][0].length > 1) {
        resultRows.push(
          <PersonRow person={result} />
        );
      }
    });

    console.log('result rows:', resultRows);

    return resultRows;
  }

  return (
    <div>
      { renderResults() }
    </div>
  );
}

export default SearchResults;
