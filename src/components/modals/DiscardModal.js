// @flow
import React from 'react';
import Modal from '@atlaskit/modal-dialog';

type Props = {
  onClose :() => void;
  actions :Object[];
};

const DiscardModal = ({ actions, onClose } :Props) => {

  // eslint-disable-next-line max-len
  const message = 'Clicking on "Discard Changes" will discard all changes made to the current Crisis Template and return to the home screen.';
  return (
    <Modal
        actions={actions}
        heading="Discard Changes?"
        appearance="warning"
        onClose={onClose}>
      <div>
        <p>
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default DiscardModal;
