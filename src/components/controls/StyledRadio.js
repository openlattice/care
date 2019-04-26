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
  display: inline-block;
  position: relative;
  color: ${props => (props.disabled ? '#8e929b' : '#2e2e34')};
  font-size: 16px;
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
  line-height: 19px;
  margin: 5px 0;
  min-height: 20px;
  padding-left: 30px;
  user-select: none;
  white-space: pre-wrap;
`;

export const RadioSelection = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #e6e6f7;
  border-radius: 50%;
  border: 1px solid #e6e6f7;

  ${RadioContainer}:hover ${RadioInputContainer} ~ & {
    background-color: #ccc;
    border-color: #ccc;
    cursor: pointer;
  }

  ${RadioContainer} ${RadioInputContainer}:checked ~ & {
    background-color: #6124e2;
    border: 1px solid #6124e2;
  }

  ${RadioContainer} ${RadioInputContainer}:disabled ~ & {
    background-color: #e6e6f7;
    border: 1px solid #e6e6f7;
    cursor: default;
  }

  ${RadioContainer} ${RadioInputContainer}:checked:disabled ~ & {
    background-color: #b6bbc7;
    border: 1px solid #b6bbc7;
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
  <RadioContainer disabled={disabled}>
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
