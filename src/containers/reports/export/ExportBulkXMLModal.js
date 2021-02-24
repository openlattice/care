// @flow
import React from 'react';

import { Modal } from 'lattice-ui-kit';

import ExportBulkXML from './ExportBulkXML';

type Props = {
  isVisible :boolean;
  onClose :() => void;
};

const ExportBulkXMLModal = ({ isVisible, onClose } :Props) => (
  <Modal
      isVisible={isVisible}
      onClose={onClose}
      textTitle="Export as XML"
      viewportScrolling
      withFooter={false}>
    <ExportBulkXML />
  </Modal>
);

export default ExportBulkXMLModal;
