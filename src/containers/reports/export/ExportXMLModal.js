// @flow
import React from 'react';

import { Modal } from 'lattice-ui-kit';

import ExportXML from './ExportXML';

type Props = {
  isVisible :boolean;
  onClose :() => void;
};

const ExportXMLModal = ({ isVisible, onClose } :Props) => (
  <Modal
      isVisible={isVisible}
      onClose={onClose}
      textTitle="Export as XML"
      viewportScrolling
      withFooter={false}>
    <ExportXML />
  </Modal>
);

export default ExportXMLModal;
