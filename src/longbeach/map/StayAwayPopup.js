// @flow
import React from 'react';

import styled from 'styled-components';
import {
  faBirthdayCake,
  faDraftingCompass,
  faMapMarkerAltSlash,
  faTimes,
  faUser,
  faVenusMars
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { IconButton } from 'lattice-ui-kit';
import { Popup } from 'react-mapbox-gl';
import { useSelector } from 'react-redux';

import Detail from '../../components/premium/styled/Detail';
import {
  OPENLATTICE_ID_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN
} from '../../edm/DataModelFqns';
import { getAddressFromLocation } from '../../utils/AddressUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';

const ActionBar = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled(IconButton)`
  color: inherit;
  padding: 2px;
`;
const CloseIcon = <FontAwesomeIcon icon={faTimes} fixedWidth />;

type Props = {
  coordinates :GeoJSON.Position;
  isOpen :boolean;
  stayAwayLocation :Map;
  onClose :() => void;
};

const StayAwayPopup = ({
  coordinates,
  isOpen,
  onClose,
  stayAwayLocation
} :Props) => {

  const locationEKID = stayAwayLocation.getIn([OPENLATTICE_ID_FQN, 0]);
  const stayAway = useSelector((store) => store.getIn(['longBeach', 'locations', 'stayAway', locationEKID])) || Map();
  const stayAwayEKID = stayAway.getIn([OPENLATTICE_ID_FQN, 0]);
  const person = useSelector((store) => store.getIn(['longBeach', 'locations', 'people', stayAwayEKID])) || Map();
  if (!isOpen) return null;

  const fullName = getLastFirstMiFromPerson(person, true);
  // $FlowFixMe
  const dob :string = getDobFromPerson(person, false, '---');
  const sex = person.getIn([PERSON_SEX_FQN, 0]);
  const race = person.getIn([PERSON_RACE_FQN, 0]);
  const { name, address } = getAddressFromLocation(stayAwayLocation);
  let nameAndAddress = address;
  if (name && address) {
    nameAndAddress = `${name}\n${address}`;
  }
  // TODO: Replace with true radius
  const radius = '100 yd';

  return (
    <Popup coordinates={coordinates}>
      <ActionBar>
        <strong>{fullName}</strong>
        <CloseButton size="sm" mode="subtle" icon={CloseIcon} onClick={onClose} />
      </ActionBar>
      <Detail content={dob} icon={faBirthdayCake} />
      <Detail content={race} icon={faUser} />
      <Detail content={sex} icon={faVenusMars} />
      <Detail content={nameAndAddress} icon={faMapMarkerAltSlash} />
      <Detail content={radius} icon={faDraftingCompass} />
    </Popup>
  );
};

export default StayAwayPopup;
