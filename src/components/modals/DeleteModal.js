// @flow
import React from 'react';
import Modal from '@atlaskit/modal-dialog';

type Props = {
  onClose :() => void;
  actions :Object[];
};

const DeleteModal = ({ actions, onClose } :Props) => {

  const message = 'Clicking on "Delete Template" will delete the current Crisis Template and return to the home screen.';
  return (
    <Modal
        actions={actions}
        heading="Delete Template"
        appearance="warning"
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
