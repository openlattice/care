/*
 * @flow
 */

import React from 'react';
import { Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import styled from 'styled-components';


const SearchWrapper = styled(FormGroup)`
  display: flex;
`;

const SearchInputGroup = styled(InputGroup)`
  width: 100%;
  display: inline-block;
`;

const SearchButton = styled(Button)`
  margin: 0 10px;
`;


const SearchBar = ({ handleInput, query, onSearchSubmit }) => {
  return (
    <div>
      <SearchWrapper>
        <SearchInputGroup>
          <FormControl
              value={query}
              type="text"
              onChange={handleInput} />
        </SearchInputGroup>
        <SearchButton type="submit" bsStyle="primary" onClick={onSearchSubmit}>Search</SearchButton>
      </SearchWrapper>
    </div>
  );
}

export default SearchBar;
