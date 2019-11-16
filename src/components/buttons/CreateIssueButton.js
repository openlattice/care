// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { faCommentAltPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { IconButton, Hooks } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import { resetIssueState } from '../../containers/issues/issue/IssueActions';

import CreateIssueModal from '../modals/CreateIssueModal';

const { useBoolean } = Hooks;

const ChangeButton = styled(IconButton)`
  color: inherit;
  background-color: inherit;
  padding: 2px;
`;

const ChangeIcon = <FontAwesomeIcon icon={faCommentAltPlus} fixedWidth />;

type Props = {
  mode :string;
  defaultComponent :string;
};

const NewIssueButton = (props :Props) => {
  const {
    defaultComponent,
    mode,
  } = props;

  const [isVisible, onOpen, onClose] = useBoolean();
  const assignee :Map = useSelector((store :Map) => store.getIn(['profile', 'about', 'data']));
  const currentUser :Map = useSelector((store :Map) => store.getIn(['staff', 'currentUser', 'data']));
  const person = useSelector((store :Map) => store
    .getIn(['profile', 'basicInformation', 'basics', 'data']));
  const submitState = useSelector((store) => store.getIn(['issues', 'issue', 'submitState']));

  useEffect(() => {
    if (submitState === RequestStates.SUCCESS) {
      onClose();
    }
  }, [onClose, submitState]);

  return (
    <>
      <ChangeButton mode={mode} onClick={onOpen} icon={ChangeIcon} />
      <CreateIssueModal
          assignee={assignee}
          submitState={submitState}
          currentUser={currentUser}
          defaultComponent={defaultComponent}
          isVisible={isVisible}
          onClose={onClose}
          person={person} />
    </>
  );
};

export default React.memo<Props>(NewIssueButton);
