// @flow
import React, { useEffect } from 'react';

import { Map } from 'immutable';
import { Select } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import LinkButton from '../../components/buttons/LinkButton';
import * as FQN from '../../edm/DataModelFqns';
import { goToPath } from '../../core/router/RoutingActions';
import { getEntityKeyId } from '../../utils/DataUtils';
import { getDateShortFromIsoDate } from '../../utils/DateUtils';
import { clearIncidents, getProfileIncidents } from '../profile/actions/ReportActions';

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
    return {
      label: `#${incidentNumber} (${formattedDateTime})`,
      value: incidentData
    };
  });

  return (
    <div>
      {`File a ${state.type} for an existing incident`}
      <Select
          placeholder="Select an incident"
          options={incidentOptions}
          onChange={(option) => {
            dispatch(goToPath(state.path, { selectedPerson: state.person, incident: option.value }));
          }}
          isLoading={fetchState === RequestStates.PENDING} />
      or
      <p>{`File a ${state.type} against a new incident`}</p>
      <LinkButton to={state.path} state={{ selectedPerson: state.person }}>New Incident</LinkButton>
    </div>
  );
};

export default IncidentSelection;
