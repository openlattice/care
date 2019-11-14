// @flow
import React from 'react';
import styled from 'styled-components';
// import { Map } from 'immutable';
import { IconButton, Hooks } from 'lattice-ui-kit';
import { faCommentAltPlus } from '@fortawesome/pro-solid-svg-icons'
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
  defaultComponent :any;
  selectedPerson :Map;
};

const RequestChangeButton = (props :Props) => {
  const {
    defaultComponent,
    mode,
    selectedPerson,
  } = props;
  const [isVisible, onOpen, onClose] = useBoolean();

  return (
    <>
      <ChangeButton mode={mode} onClick={onOpen} icon={ChangeIcon} />
      <RequestChangeModal
          defaultComponent={defaultComponent}
          selectedPerson={selectedPerson}
          isVisible={isVisible}
          onClose={onClose} />
    </>
  );
};

export default React.memo<Props>(RequestChangeButton);
