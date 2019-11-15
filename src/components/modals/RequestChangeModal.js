// @flow
import React, { useRef } from 'react';
import { Map } from 'immutable';
import { Modal } from 'lattice-ui-kit';

import RequestChangeForm from '../../containers/inbox/request/RequestChangesForm';

type Props = {
  assignee :Map;
  currentUser :Map;
  defaultComponent :string;
  isVisible :boolean;
  onClose :() => void;
  person :Map;
};

const RequestChangeModal = (props :Props) => {
  const {
    assignee,
    currentUser,
    defaultComponent,
    isVisible,
    onClose,
    person,
  } = props;
  const formRef = useRef();

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <Modal
        isVisible={isVisible}
        onClickPrimary={handleExternalSubmit}
        onClose={onClose}
        shouldCloseOnOutsideClick={false}
        textPrimary="Submit"
        textSecondary="Discard"
        textTitle="Request Changes"
        viewportScrolling>
      <RequestChangeForm
          assignee={assignee}
          currentUser={currentUser}
          defaultComponent={defaultComponent}
          person={person}
          ref={formRef} />
    </Modal>
  );
};

export default React.memo<Props>(RequestChangeModal);
