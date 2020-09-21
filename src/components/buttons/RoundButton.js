/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons';

type Props = {
  type :string,
  onClick :Function
};

const Button = styled.button`
  width: 35px;
  height: 35px;
  background-color: #eaeaf0;
  color: #555e6f;
  border-radius: 50%;
  border: none;

  &:focus {
    outline: none;
  }

  &:hover:enabled {
    cursor: pointer;
    background-color: #dcdce7;
  }
`;

const RoundButton = ({ type, onClick } :Props) => {

  let icon = null;
  if (type === 'add') {
    icon = <FontAwesomeIcon icon={faPlus} />;
  }
  if (type === 'delete') {
    icon = <FontAwesomeIcon icon={faTrashAlt} />;
  }

  return <Button onClick={onClick}>{icon}</Button>;
};

export default RoundButton;
