import React from 'react';
import PropTypes from 'prop-types';
import { Button, ControlLabel, FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import styled from 'styled-components';

import { randomId } from '../utils/Utils';

const SearchWrapper = styled(FormGroup)`
  margin-bottom: 30px;
`;

const SearchBar = ({
  handleInput,
  query,
  title,
  onSearchSubmit
}) => {

  const handleOnKeyDown = (event) => {

    switch (event.keyCode) {
      case 13: {
        // 'Enter' key code
        if (query && query.length > 0) {
          onSearchSubmit();
        }
        break;
      }
      default:
        break;
    }
  };

  const handleOnClick = () => {
    if (query && query.length > 0) {
      onSearchSubmit();
    }
  };

  return (
    <div>
      <SearchWrapper controlId={randomId()}>
        {
          (title && title.length > 0)
            ? <ControlLabel>{ title }</ControlLabel>
            : null
        }
        <InputGroup>
          <FormControl
              value={query}
              type="text"
              onChange={handleInput}
              onKeyDown={handleOnKeyDown} />
          <InputGroup.Button>
            <Button type="submit" onClick={handleOnClick}>Search</Button>
          </InputGroup.Button>
        </InputGroup>
      </SearchWrapper>
    </div>
  );
};

SearchBar.propTypes = {
  handleInput: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onSearchSubmit: PropTypes.func.isRequired
};

export default SearchBar;
