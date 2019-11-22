// @flow
import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
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
  defaultComponent ? :string;
  isVisible :boolean;
  onClose :() => void;
  person :Map;
};

const CreateIssueModal = (props :Props) => {
  const {
    assignee,
    currentUser,
    defaultComponent,
    isVisible,
    onClose,
    person,
  } = props;
  const formRef = useRef();

  const submitState :RequestState = useSelector((store) => store.getIn(['issues', 'issue', 'submitState']));

  useEffect(() => {
    if (submitState === RequestStates.SUCCESS) {
      onClose();
    }
  }, [onClose, submitState]);

  const handleExternalSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.submit();
    }
  }, [formRef]);

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

CreateIssueModal.defaultProps = {
  defaultComponent: '',
};

export default React.memo<Props>(CreateIssueModal);
