// @flow
import React from 'react';
import styled from 'styled-components';
import { Modal } from 'lattice-ui-kit';
import SubjectInformation from '../pages/subjectinformation/SubjectInformation';

const StyledSubjectInformation = styled(SubjectInformation)`
  min-width: 600px;
  margin: -20px -30px;
`;

type Props = {
  isVisible :boolean;
  onClose :() => void;
  // onClickPrimary :() => void;
  // shouldStretchButtons :Boolean;
  // textPrimary :string;
  // textTitle :string;
}

const EditProfileModal = ({ isVisible, onClose } :Props) => {
  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary="Submit">
      <StyledSubjectInformation />
    </Modal>
  );
};

export default EditProfileModal;
