// @flow
import React from 'react';

import styled from 'styled-components';
import { faCommentAltLines } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Hooks, IconButton } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import IssueModal from '../../containers/issues/issue/IssueModal';

const { useBoolean } = Hooks;

const ChangeIcon = <FontAwesomeIcon icon={faCommentAltLines} fixedWidth />;
const StyledButton = styled(IconButton)`
  padding: 10px;
  background-color: #E5E5F0;
  border-color: #E5E5F0;
`;

type Props = {
  className ?:string;
  defaultComponent ?:string;
  mode ?:string;
};

const CreateIssueButton = (props :Props) => {
  const {
    className,
    defaultComponent,
    mode,
  } = props;

  const [isVisible, onOpen, onClose] = useBoolean();
  const assignee :Map = useSelector((store :Map) => store.getIn(['profile', 'about', 'data']));
  const currentUser :Map = useSelector((store :Map) => store.getIn(['staff', 'currentUser', 'data']));
  const person = useSelector((store :Map) => store
    .getIn(['profile', 'basicInformation', 'basics', 'data']));

  return (
    <>
      <StyledButton className={className} mode={mode} onClick={onOpen} icon={ChangeIcon} />
      <IssueModal
          assignee={assignee}
          currentUser={currentUser}
          defaultComponent={defaultComponent}
          isVisible={isVisible}
          onClose={onClose}
          person={person} />
    </>
  );
};

CreateIssueButton.defaultProps = {
  className: undefined,
  defaultComponent: undefined,
  mode: undefined,
};

export default React.memo<Props>(CreateIssueButton);
