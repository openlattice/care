// @flow
import React from 'react';
import styled from 'styled-components';
import { Map } from 'immutable';
import { useSelector } from 'react-redux';
import { IconButton, Hooks } from 'lattice-ui-kit';
import { faCommentAltPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import RequestChangeModal from '../modals/RequestChangeModal';

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

const RequestChangeButton = (props :Props) => {
  const {
    defaultComponent,
    mode,
  } = props;

  const [isVisible, onOpen, onClose] = useBoolean();
  const person = useSelector((store :Map) => store
    .getIn(['profile', 'basicInformation', 'basics', 'data']));
  const currentUser :Map = useSelector((store :Map) => store.getIn(['staff', 'currentUser', 'data']));
  const assignee :Map = useSelector((store :Map) => store.getIn(['profile', 'about', 'data']));

  return (
    <>
      <ChangeButton mode={mode} onClick={onOpen} icon={ChangeIcon} />
      <RequestChangeModal
          person={person}
          currentUser={currentUser}
          assignee={assignee}
          defaultComponent={defaultComponent}
          isVisible={isVisible}
          onClose={onClose} />
    </>
  );
};

export default React.memo<Props>(RequestChangeButton);
