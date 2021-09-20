// @flow
import React from 'react';

import { Modal } from 'lattice-ui-kit';

import ExportBulk from './ExportBulk';

type Props = {
  isVisible :boolean;
  onClose :() => void;
};

const ExportBulkXMLModal = ({ isVisible, onClose } :Props) => (
  <Modal
      isVisible={isVisible}
      onClose={onClose}
      textTitle="Download Report"
      viewportScrolling
      withFooter={false}>
    <ExportBulk />
  </Modal>
);

export default ExportBulkXMLModal;
