/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import styled from 'styled-components';


const SearchWrapper = styled(FormGroup)`
  margin-bottom: 50px;
`;

const SearchBar = ({ handleInput, query, onSearchSubmit }) => {
  return (
    <div>
      <SearchWrapper>
        <InputGroup>
          <FormControl
              value={query}
              type="text"
              onChange={handleInput} />
          <InputGroup.Button>
            <Button type="submit" onClick={onSearchSubmit}>Search</Button>
          </InputGroup.Button>
        </InputGroup>
      </SearchWrapper>
    </div>
  );
};

SearchBar.propTypes = {
  handleInput: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  onSearchSubmit: PropTypes.func.isRequired
};

export default SearchBar;
