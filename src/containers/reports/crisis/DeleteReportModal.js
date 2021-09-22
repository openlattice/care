// @flow
import React from 'react';

import { Modal, Typography } from 'lattice-ui-kit';

type Props = {
  isVisible :boolean;
  onClose :() => void;
  onClickPrimary :() => void;
};

const DeleteReportModal = ({ isVisible, onClose, onClickPrimary } :Props) => (
  <Modal
      isVisible={isVisible}
      onClose={onClose}
      onClickPrimary={onClickPrimary}
      textTitle="Delete Report"
      viewportScrolling
      shouldStretchButtons
      textPrimary="Delete"
      textSecondary="Cancel">
    <Typography>Are you sure you want to delete this report? This action cannot be undone.</Typography>
  </Modal>
);

export default DeleteReportModal;
