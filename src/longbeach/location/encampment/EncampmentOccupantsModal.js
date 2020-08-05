// @flow

import React from 'react';

import { Modal } from 'lattice-ui-kit';
import type { UUID } from 'lattice';

import EncampmentOccupants from './EncampmentOccupants';

type Props = {
  encampmentEKID :UUID;
};

const EncampmentOccupantsModal = ({ encampmentEKID, ...props } :Props) =>
  /* eslint-disable react/jsx-props-no-spreading */
  (
    <Modal {...props} textTitle="Occupants">
      <EncampmentOccupants encampmentEKID={encampmentEKID} />
    </Modal>
  )
  /* eslint-enable */
;

export default EncampmentOccupantsModal;
