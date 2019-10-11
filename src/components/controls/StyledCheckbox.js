/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

const Control = styled.label`
  display: inline-block;
  position: relative;
  color: ${(props) => (props.disabled ? '#8e929b' : '#2e2e34')};
  font-size: 16px;
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
  line-height: 19px;
  margin: 5px 0;
  min-height: 20px;
  padding: 0 10px 0 30px;
  vertical-align: middle;

  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
`;

const CheckboxInput = styled.input.attrs({
  type: 'checkbox'
})`
  position: absolute;
  z-index: -1;
  opacity: 0;
  vertical-align: middle;
  
  :focus + div {
    background: #ccc;
  }
`;

const CheckboxIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background: #e6e6f7;
  border-radius: 3px;

  ${Control}:hover input ~ &,
  ${Control} input:focus & {
    background: #ccc;
    cursor: pointer;
  }

  ${Control} input:checked ~ & {
    background: #6124e2;
  }

  ${Control} input:disabled ~ & {
    background: #e6e6f7;
    cursor: default;
  }

  ${Control} input:checked:disabled ~ &{
    background: #b6bbc7;
  }

  &:after {
    content: '';
    position: absolute;
    display: none;
    left: 8px;
    top: 4px;
    width: 3px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);

    ${Control} input:checked ~ & {
      display: block;
    }

    ${Control} & {
      left: 8px;
      top: 4px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
`;

const CheckboxLabel = styled.span`
  margin-left: 5px;
  font-weight: ${(props) => (props.bold ? 600 : 400)};
`;

type Props = {
  name :string,
  label :string,
  value :string,
  checked :boolean,
  onChange :(event :Object) => void,
  disabled? :boolean,
  dataSection? :?string,
  bold? :string,
  noMargin? :boolean
};

const StyledCheckbox = ({
  name,
  label,
  value,
  checked,
  onChange,
  disabled,
  dataSection,
  bold,
  noMargin
} :Props) => (
  <Control disabled={disabled} checked={checked} noMargin={noMargin}>
    <CheckboxLabel bold={bold}>{label}</CheckboxLabel>
    <CheckboxInput
        data-section={dataSection}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled} />
    <CheckboxIndicator />
  </Control>
);

StyledCheckbox.defaultProps = {
  disabled: false,
  dataSection: '',
  bold: false,
  noMargin: false
};

export default StyledCheckbox;
