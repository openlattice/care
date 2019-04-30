// @flow
import React from 'react';
import Modal from '@atlaskit/modal-dialog';

type Props = {
  onClose :() => void;
  onDiscard :() => void;
};

const DiscardModal = ({ onClose, onDiscard } :Props) => {
  const actions = [
    {
      onClick: onClose,
      text: 'Stay On Page'
    },
    {
      onClick: onDiscard,
      text: 'Discard Changes'
    }
  ];

  // eslint-disable-next-line max-len
  const message = 'Clicking on "Discard Changes" will discard all changes made to the current Crisis Template and return to the home screen.';
  return (
    <Modal
        actions={actions}
        heading="Discard changes?"
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
