/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

import PersonRow from './PersonRow';
import { PERSON } from '../shared/Consts';

const ResultsWrapper = styled.div`
  margin-bottom: 50px;
`;

const SearchResults = ({ results, handlePersonSelection }) => {
  const renderResults = () => {
    const firstNameFqn = 'nc.PersonGivenName';
    const lastNameFqn = 'nc.PersonSurName';
    const resultRows = [];
    results.forEach((result) => {
      if (result[PERSON.FIRST_NAME_FQN] && result[PERSON.FIRST_NAME_FQN][0].length > 1 && result[PERSON.LAST_NAME_FQN] && result[PERSON.LAST_NAME_FQN][0].length > 1) {
        resultRows.push(
          <PersonRow person={result} handlePersonSelection={handlePersonSelection} key={result[PERSON.ID_FQN]} />
        );
      }
    });

    return resultRows;
  }

  return (
    <ResultsWrapper>
      { renderResults() }
    </ResultsWrapper>
  );
}

export default SearchResults;
