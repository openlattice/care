// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Button, Label } from 'lattice-ui-kit';

import IncidentSelection from './IncidentSelection';

import LinkButton from '../../components/buttons/LinkButton';
import { useAppSettings } from '../../components/hooks';
import {
  CRISIS_PATH,
  NEW_CRISIS_CLINICIAN_PATH,
  NEW_CRISIS_PATH,
  NEW_FOLLOW_UP_PATH,
  NEW_SYMPTOMS_PATH,
  TRACK_CONTACT_PATH,
} from '../../core/router/Routes';
import { getFirstLastFromPerson } from '../../utils/PersonUtils';
import { CRISIS_REPORT, CRISIS_REPORT_CLINICIAN, FOLLOW_UP_REPORT } from '../reports/crisis/schemas/constants';

const BodyWrapper = styled.div`
  max-width: 100%;
  width: 500px;
`;

const ActionWrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 10px;
  padding-bottom: 30px;
`;

type Props = {
  selectedPerson :Map;
};

const ReportSelectionBody = (props :Props) => {
  const { selectedPerson } = props;

  const [settings] = useAppSettings();
  const crisisPath = (settings.get('v1') || settings.get('v2')) ? NEW_CRISIS_PATH : `${CRISIS_PATH}/1`;
  const name = getFirstLastFromPerson(selectedPerson);
  const [state, setState] = useState();

  let content = (
    <ActionWrapper>
      {
        settings.get('v2')
          ? (
            <>
              <Button
                  onClick={() => setState({ type: CRISIS_REPORT, path: crisisPath, person: selectedPerson })}>
                Crisis Report
              </Button>
              <Button
                  onClick={() => (
                    setState({
                      path: NEW_CRISIS_CLINICIAN_PATH,
                      person: selectedPerson,
                      type: CRISIS_REPORT_CLINICIAN,
                    })
                  )}>
                Crisis Report (Clinician)
              </Button>
              <Button
                  onClick={() => (
                    setState({ type: FOLLOW_UP_REPORT, path: NEW_FOLLOW_UP_PATH, person: selectedPerson })
                  )}>
                Follow-up
              </Button>
            </>
          )
          : (
            <LinkButton
                to={crisisPath}
                state={{ selectedPerson }}>
              Crisis Report
            </LinkButton>
          )
      }
      <LinkButton
          to={NEW_SYMPTOMS_PATH}
          state={selectedPerson}>
        Symptoms Report
      </LinkButton>
      <LinkButton
          to={TRACK_CONTACT_PATH}
          state={selectedPerson}>
        Track Your Contact
      </LinkButton>
    </ActionWrapper>
  );

  if (state) {
    content = <IncidentSelection state={state} />;
  }

  return (
    <BodyWrapper>
      <span>
        <Label subtle>For: </Label>
        <span>{name}</span>
      </span>
      {content}
    </BodyWrapper>
  );
};

export default ReportSelectionBody;
