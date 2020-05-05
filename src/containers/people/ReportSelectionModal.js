// @flow
import React from 'react';

import { Map } from 'immutable';
import { Modal } from 'lattice-ui-kit';

import ReportSelectionBody from './ReportSelectionBody';

type Props = {
  isVisible :boolean;
  selectedPerson :Map;
  onClose :() => void;
};

const ReportSelectionModal = (props :Props) => {
  const { isVisible, selectedPerson, onClose } = props;

  return (
    <Modal
        textTitle="Select Report Type"
        isVisible={isVisible}
        onClose={onClose}>
      <ReportSelectionBody selectedPerson={selectedPerson} />
    </Modal>
  );
};

export default ReportSelectionModal;
