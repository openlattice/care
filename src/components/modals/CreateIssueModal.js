// @flow
import React, { useRef } from 'react';
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import { ActionModal } from 'lattice-ui-kit';
import type { RequestState } from 'redux-reqseq';

import IssueForm from '../../containers/issues/issue/IssueForm';

const emptyBody = {
  [RequestStates.PENDING]: <></>,
  [RequestStates.SUCCESS]: <></>,
  [RequestStates.FAILURE]: <></>,
  [RequestStates.STANDBY]: <></>,
};

type Props = {
  assignee :Map;
  currentUser :Map;
  defaultComponent :string;
  isVisible :boolean;
  onClose :() => void;
  person :Map;
  submitState :RequestState;
};

const NewIssueModal = (props :Props) => {
  const {
    assignee,
    currentUser,
    defaultComponent,
    isVisible,
    onClose,
    person,
    submitState,
  } = props;
  const formRef = useRef();

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <ActionModal
        requestState={submitState}
        requestStateComponents={emptyBody}
        isVisible={isVisible}
        onClickPrimary={handleExternalSubmit}
        onClose={onClose}
        shouldCloseOnOutsideClick={false}
        textPrimary="Submit"
        textSecondary="Discard"
        textTitle="Create Issue"
        viewportScrolling>
      <IssueForm
          assignee={assignee}
          currentUser={currentUser}
          defaultComponent={defaultComponent}
          person={person}
          ref={formRef} />
    </ActionModal>
  );
};

export default React.memo<Props>(NewIssueModal);
