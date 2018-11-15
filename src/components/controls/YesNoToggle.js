/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import {
  WHITE,
  OFF_WHITE,
  PURPLE,
  GREEN
} from '../../shared/Colors';

type Props = {
  value :boolean,
  onChange :(value :boolean) => void
}

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 3px;
  border: 2px solid ${PURPLE};
  height: 40px;
  width: 130px;
`;

const ToggleTab = styled.div`
  width: 50%;
  height: 100%;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: ${props => (props.selected ? PURPLE : WHITE)};
  color: ${props => (props.selected ? WHITE : PURPLE)};

  &:hover {
    cursor: pointer;
    background-color: ${props => (props.selected ? PURPLE : OFF_WHITE)};
  }

  &:first-child {
    border-radius: ${props => (props.selected ? 0 : '3px 0 0 3px')};
  }

  &:last-child {
    border-radius: ${props => (props.selected ? 0 : '0 3px 3px 0')};
  }

`;

const YesNoToggle = ({ value, onChange } :Props) => {

  return (
    <ToggleWrapper>
      <ToggleTab selected={!value} onClick={() => onChange(false)}>No</ToggleTab>
      <ToggleTab selected={value} onClick={() => onChange(true)}>Yes</ToggleTab>
    </ToggleWrapper>
  );
};

export default YesNoToggle;
