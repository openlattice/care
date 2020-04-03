// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Label, Modal } from 'lattice-ui-kit';

import LinkButton from '../../components/buttons/LinkButton';
import { useAppSettings } from '../../components/hooks';
import {
  CRISIS_PATH,
  NEW_CRISIS_PATH,
  NEW_SYMPTOMS_PATH,
} from '../../core/router/Routes';
import { getFirstLastFromPerson } from '../../utils/PersonUtils';

const ActionWrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 10px;
  max-width: 100%;
  width: 500px;
  padding-bottom: 30px;
`;

type Props = {
  isVisible :boolean;
  selectedPerson :Map;
  onClose :() => void;
};

const ReportSelectionModal = (props :Props) => {
  const { isVisible, selectedPerson, onClose } = props;
  const settings = useAppSettings();
  const crisisPath = settings.get('v1') ? NEW_CRISIS_PATH : CRISIS_PATH;
  const name = getFirstLastFromPerson(selectedPerson);
  return (
    <Modal
        textTitle="Select Report Type"
        isVisible={isVisible}
        onClose={onClose}>

      <div>
        <span>
          <Label subtle>For: </Label>
          <span>{name}</span>
        </span>
        <ActionWrapper>
          <LinkButton
              to={crisisPath}
              state={selectedPerson}>
            Behavioral Health Report
          </LinkButton>
          <LinkButton
              to={NEW_SYMPTOMS_PATH}
              state={selectedPerson}>
            Symptoms Report
          </LinkButton>
          <LinkButton
              to=""
              state={selectedPerson}>
            Track Contact
          </LinkButton>
        </ActionWrapper>
      </div>
    </Modal>
  );
};

export default ReportSelectionModal;
