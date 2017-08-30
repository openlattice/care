/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

const SearchResults = ({ results, onPersonSelection }) => {
  return (
    <div>
    {
      results.forEach((result) => {
        console.log('result:', result);
        if (result['nc.PersonSurName']) {
          return <div>{result['nc.PersonSurName'][0]}</div>;
        }
      })
    }
    </div>
  );
}

export default SearchResults;
