// @flow
import React from 'react';

import styled from 'styled-components';
import { faCommentAltLines } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Button, Hooks } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import IssueModal from '../../containers/issues/issue/IssueModal';

const StyledButton = styled(Button)`
  background-color: #e5e5f0;
  min-width: 0;
  padding: 10px;
`;

const { useBoolean } = Hooks;

type Props = {
  className ?:string;
  defaultComponent ?:string;
  variant ?:string;
};

const CreateIssueButton = (props :Props) => {
  const {
    className,
    defaultComponent,
    variant,
  } = props;

  const [isVisible, onOpen, onClose] = useBoolean();
  const assignee :Map = useSelector((store :Map) => store.getIn(['profile', 'about', 'data']));
  const currentUser :Map = useSelector((store :Map) => store.getIn(['staff', 'currentUser', 'data']));
  const person = useSelector((store :Map) => store
    .getIn(['profile', 'basicInformation', 'basics', 'data']));

  return (
    <>
      <StyledButton className={className} variant={variant} onClick={onOpen}>
        <FontAwesomeIcon icon={faCommentAltLines} fixedWidth />
      </StyledButton>
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
  variant: undefined,
};

export default React.memo<Props>(CreateIssueButton);
