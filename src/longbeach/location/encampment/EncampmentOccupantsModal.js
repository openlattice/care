// @flow

import React from 'react';

import { Modal } from 'lattice-ui-kit';
import type { UUID } from 'lattice';

import EncampmentOccupants from './EncampmentOccupants';

type Props = {
  encampmentEKID :UUID;
  isVisible :boolean;
  onClose :() => void;
};

/* eslint-disable react/jsx-props-no-spreading */
const EncampmentOccupantsModal = ({ encampmentEKID, ...props } :Props) => (
  <Modal {...props} textTitle="Occupants">
    <EncampmentOccupants encampmentEKID={encampmentEKID} />
  </Modal>
);
/* eslint-enable */

export default EncampmentOccupantsModal;
