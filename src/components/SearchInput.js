/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { faSearch } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchInputWrapper = styled.div`
  color: #135;
  display: flex;
  height: 40px;
  min-height: 40px;
  min-width: 40px;
  position: relative;
  width: 400px;
`;

const Input = styled.input`
  border: 1px solid #c5d5e5;
  border-radius: 4px;
  color: #135;
  flex: 1 0 auto;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 24px;
  outline: none;
  padding: 0 20px 0 40px;

  &:focus {
    border-color: #95aabf;
  }

  &::placeholder {
    color: #687f96;
  }
`;

const SearchIcon = styled.div`
  align-self: center;
  color: #687f96;
  position: absolute;
  margin-left: 13px;
`;

type Props = {
  className :string,
  placeholder :string,
  onChange :Function,
  onSubmit :Function
}

type State = {
  searchQuery :string
}

// TODO: allow customization and extensibility via styled-components
class SearchInput extends React.Component<Props, State> {

  static defaultProps = {
    className: '',
    placeholder: 'Search...',
    onChange: () => {},
    onSubmit: () => {}
  };

  constructor(props :Props) {

    super(props);

    this.state = {
      searchQuery: ''
    };
  }

  handleOnChange = (event :SyntheticInputEvent<*>) => {

    this.setState({
      searchQuery: event.target.value
    });

    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  }

  handleOnKeyDown = (event :SyntheticKeyboardEvent<*>) => {

    switch (event.keyCode) {
      case 13: // 'Enter' key code
        if (this.state.searchQuery) {
          event.preventDefault();
          this.props.onSubmit(this.state.searchQuery);
        }
        break;
      default:
        break;
    }
  }

  render() {

    return (
      <SearchInputWrapper className={this.props.className}>
        <SearchIcon>
          <FontAwesomeIcon icon={faSearch} />
        </SearchIcon>
        <Input
            type="text"
            placeholder={this.props.placeholder}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeyDown} />
      </SearchInputWrapper>
    );
  }
}

export default SearchInput;
