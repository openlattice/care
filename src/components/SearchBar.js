/*
 * @flow
 */

import React from 'react';
import { Button, FormGroup, InputGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styled from 'styled-components';


const SearchWrapper = styled(FormGroup)`
  margin-bottom: 50px;
`;

const SearchInputGroup = styled(InputGroup)`

`;

const SearchButton = styled(Button)`
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
          <InputGroup.Button>
            <SearchButton type="submit" onClick={onSearchSubmit}>Search</SearchButton>
          </InputGroup.Button>
        </SearchInputGroup>
      </SearchWrapper>
    </div>
  );
}

export default SearchBar;
