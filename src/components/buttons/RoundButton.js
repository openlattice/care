/*
 * @flow
 */

import React from 'react';

import { faPlus } from '@fortawesome/pro-light-svg-icons';
import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from 'lattice-ui-kit';

type Props = {
  type :string,
  onClick :Function
};

const RoundButton = ({ type, onClick } :Props) => {

  let icon = null;
  if (type === 'add') {
    icon = <FontAwesomeIcon icon={faPlus} fixedWidth />;
  }
  if (type === 'delete') {
    icon = <FontAwesomeIcon icon={faTrashAlt} fixedWidth />;
  }

  return <IconButton onClick={onClick}>{icon}</IconButton>;
};

export default RoundButton;
