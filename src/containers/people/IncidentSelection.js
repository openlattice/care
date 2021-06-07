// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Label, Select } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import LinkButton from '../../components/buttons/LinkButton';
import * as FQN from '../../edm/DataModelFqns';
import { goToPath } from '../../core/router/RoutingActions';
import { getEntityKeyId } from '../../utils/DataUtils';
import { getDateShortFromIsoDate } from '../../utils/DateUtils';
import { clearIncidents, getProfileIncidents } from '../profile/actions/ReportActions';
import { FOLLOW_UP_REPORT } from '../reports/crisis/schemas/constants';

const Wrapper = styled.div`
  padding-bottom: 30px;
`;

const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;

type Props = {
  state :{ path :string, person :Map, type :string };
};

const IncidentSelection = (props :Props) => {
  const { state } = props;
  const fetchState = useSelector((store) => store.getIn(['incidents', 'fetchState']));
  const incidents = useSelector((store) => store.getIn(['incidents', 'data']));
  const dispatch = useDispatch();

  const personEKID = getEntityKeyId(state.person);

  useEffect(() => {
    if (personEKID) {
      dispatch(getProfileIncidents(personEKID));
    }
    return () => dispatch(clearIncidents());
  }, [dispatch, personEKID]);

  const incidentOptions = incidents.map((incident) => {
    const incidentData = incident.get('neighborDetails');
    const incidentNumber = incidentData.getIn([FQN.CRIMINALJUSTICE_CASE_NUMBER_FQN, 0]);
    const incidentDatetime = incidentData.getIn([FQN.DATETIME_START_FQN, 0]);
    const formattedDateTime = getDateShortFromIsoDate(incidentDatetime);

    const label = incidentNumber ? `${formattedDateTime} (#${incidentNumber})` : formattedDateTime;
    return {
      label,
      value: incidentData
    };
  });

  return (
    <Wrapper>
      <span>
        <Label subtle>Type: </Label>
        <span>{state.type}</span>
      </span>
      <Select
          placeholder="Select a prior incident"
          options={incidentOptions}
          onChange={(option) => {
            dispatch(goToPath(state.path, { selectedPerson: state.person, incident: option.value }));
          }}
          isLoading={fetchState === RequestStates.PENDING} />
      {
        (state.type !== FOLLOW_UP_REPORT) && (
          <>
            <Centered>
              <Label subtle>or</Label>
            </Centered>
            <LinkButton fullWidth to={state.path} state={{ selectedPerson: state.person }}>New Incident</LinkButton>
          </>
        )
      }
    </Wrapper>
  );
};

export default IncidentSelection;
