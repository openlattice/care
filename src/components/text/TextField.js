/*
 * @flow
 */

import React, { Component } from 'react';

import isFunction from 'lodash/isFunction';
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

import FieldHeader from './styled/FieldHeader';
import { isNonEmptyString } from '../../utils/LangUtils';

const { NEUTRALS, PURPLES, WHITE } = Colors;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledInput = styled.input`
  background-color: ${NEUTRALS[8]};
  border: 1px solid ${NEUTRALS[4]};
  border-radius: 3px;
  color: #2e2e34;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: normal;
  outline: none;
  padding: 10px 20px;
  &:hover {
    background-color: ${NEUTRALS[6]};
  }
  &:disabled {
    background-color: ${NEUTRALS[8]};
    cursor: not-allowed;
  }
  &:focus {
    background-color: ${WHITE};
    border-color: ${PURPLES[1]};
  }
  &::placeholder {
    color: ${NEUTRALS[1]};
  }
`;

type Props = {
  className ? :string;
  disabled ? :boolean;
  header ? :string;
  name ? :string;
  placeholder ? :string;
  onChange :Function;
};

class TextField extends Component<Props> {

  static defaultProps = {
    className: '',
    disabled: false,
    header: undefined,
    name: undefined,
    placeholder: undefined,
  };

  handleOnChange = (event :SyntheticInputEvent<*>) => {

    const { onChange } = this.props;
    if (isFunction(onChange)) {
      onChange(event);
    }
  }

  render() {

    const {
      className,
      disabled,
      header,
      name,
      placeholder
    } = this.props;

    return (
      <FieldWrapper>
        {
          isNonEmptyString(header)
            ? <FieldHeader>{ header }</FieldHeader>
            : null
        }
        <StyledInput
            className={className}
            disabled={disabled}
            name={name}
            onChange={this.handleOnChange}
            placeholder={placeholder}
            type="text" />
      </FieldWrapper>
    );
  }
}

export default TextField;
