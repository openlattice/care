/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

export const RadioInputContainer = styled.input.attrs({
  type: 'radio'
})`
  position: absolute;
  opacity: 0;
`;

export const RadioContainer = styled.label`
  display: inline-flex;
  position: relative;
  padding-left: 30px;
  margin: 5px;
  font-size: 14px;
  color: #2e2e34;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-weight: normal;
`;

export const RadioSelection = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #e6e6f7;
  border-radius: 50%;
  border: 1px solid #c9c9da;

  ${RadioContainer}:hover ${RadioInputContainer} ~ & {
    background-color: #ccc;
    cursor: pointer;
  }

  ${RadioContainer} ${RadioInputContainer}:checked ~ & {
    background-color: #6124e2;
    border: 1px solid #6124e2;
  }

  ${RadioContainer} ${RadioInputContainer}:disabled ~ & {
    background-color: white;
    cursor: default;
  }

  &:after {
    content: "";
    position: absolute;
    display: none;
  }

  ${RadioContainer} ${RadioInputContainer}:checked ~ &:after {
    display: block;
  }

  ${RadioContainer} &:after {
    top: 6px;
    left: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: white;
  }

  ${RadioContainer} ${RadioInputContainer}:disabled ~ &:after {
    background-color: #ccc;
  }
`;

type Props = {
  name? :string,
  label :string,
  value :string | boolean,
  checked? :boolean,
  onChange :() => void,
  disabled? :boolean
}

const StyledRadio = ({
  name,
  label,
  value,
  checked,
  onChange,
  disabled
} :Props) => (
  <RadioContainer>
    {label}
    <RadioInputContainer
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled} />
    <RadioSelection />
  </RadioContainer>
);

StyledRadio.defaultProps = {
  disabled: false,
  name: undefined,
  checked: false
};

export default StyledRadio;
