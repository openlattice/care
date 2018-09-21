import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PersonRow from './PersonRow';
import { PERSON } from '../shared/Consts';

const NoResults = styled.div`
  text-align: center;
  font-weight: bold;
`;

const SearchResults = ({ results, handlePersonSelection, didSearch }) => {
  const renderResults = () => {
    if (results.length === 0 && didSearch) {
      return <NoResults><div>No results</div></NoResults>;
    }

    const resultRows = [];
    results.forEach((result) => {
      if (
        result[PERSON.FIRST_NAME_FQN]
          && result[PERSON.FIRST_NAME_FQN][0].length > 1
          && result[PERSON.LAST_NAME_FQN]
          && result[PERSON.LAST_NAME_FQN][0].length > 1
      ) {
        resultRows.push(
          <PersonRow person={result} handlePersonSelection={handlePersonSelection} key={result[PERSON.ID_FQN]} />
        );
      }
    });

    return resultRows;
  };

  return (
    <div>
      { renderResults() }
    </div>
  );
};

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.array.isRequired,
    'nc.PersonBirthDate': PropTypes.array,
    'nc.PersonGivenName': PropTypes.array,
    'nc.PersonMiddleName': PropTypes.array,
    'nc.PersonRace': PropTypes.array,
    'nc.PersonSex': PropTypes.array,
    'nc.PersonSurName': PropTypes.array,
    'nc.SubjectIdentification': PropTypes.array.isRequired,
    'person.age': PropTypes.array
  })).isRequired,
  handlePersonSelection: PropTypes.func.isRequired,
  didSearch: PropTypes.bool.isRequired
};

export default SearchResults;
