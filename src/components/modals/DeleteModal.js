// @flow
import React from 'react';
import Modal from '@atlaskit/modal-dialog';

type Props = {
  onClose :() => void;
  actions :Object[];
};

const DeleteModal = ({ actions, onClose } :Props) => {

  const message = 'Clicking on "Delete Report" will delete the current Crisis Report and return to the home screen.';
  return (
    <Modal
        actions={actions}
        heading="Delete Report"
        appearance="danger"
        onClose={onClose}>
      <div>
        <p>
          {message}
        </p>
        <p>
          This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteModal;
