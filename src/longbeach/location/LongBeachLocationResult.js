// @flow

import React from 'react';

import { Map } from 'immutable';
import { Constants } from 'lattice';
import { useSelector } from 'react-redux';

import LongBeachResult from '../styled/LongBeachResult';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  result :Map;
}

const LongBeachLocationResult = (props :Props) => {

  const { result: locationEKID } = props;

  const person = useSelector((store) => {
    const stayAwayEKID = store.getIn(['longBeach', 'locations', 'stayAway', locationEKID, OPENLATTICE_ID_FQN, 0]);
    return store.getIn(['longBeach', 'locations', 'people', stayAwayEKID], Map());
  });
  const personEKID = person.getIn([OPENLATTICE_ID_FQN, 0]);
  const profilePicture = useSelector((store) => store
    .getIn(['longBeach', 'locations', 'profilePictures', personEKID], Map()));
  const stayAwayLocation = useSelector((store) => store
    .getIn(['longBeach', 'locations', 'stayAwayLocations', locationEKID], Map()));

  return (
    <LongBeachResult
        person={person}
        stayAwayLocation={stayAwayLocation}
        profilePicture={profilePicture} />
  );
};

export default React.memo<Props>(LongBeachLocationResult);
