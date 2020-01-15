// @flow

import React from 'react';

import {
  faBirthdayCake,
  faMapMarkerAltSlash,
  faUser,
  faVenusMars
} from '@fortawesome/pro-solid-svg-icons';
import { Map } from 'immutable';
import { Constants } from 'lattice';
import { Card } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';

import Detail from '../../components/premium/styled/Detail';
import Portrait from '../../components/portrait/Portrait';
import { useGoToPath } from '../../components/hooks';
import { clearProfile, selectPerson } from '../../containers/profile/ProfileActions';
import {
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
} from '../../core/router/Routes';
import {
  PERSON_RACE_FQN,
  PERSON_SEX_FQN
} from '../../edm/DataModelFqns';
import { getAddressFromLocation } from '../../utils/AddressUtils';
import { getImageDataFromEntity } from '../../utils/BinaryUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import {
  FlexRow,
  ResultDetails,
  ResultName,
  ResultSegment,
} from '../styled';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  result :Map;
}

const LongBeachLocationResult = (props :Props) => {

  const { result } = props;

  const locationEKID = result.getIn([OPENLATTICE_ID_FQN, 0]);
  const person = useSelector((store) => {
    const stayAwayEKID = store.getIn(['longBeach', 'locations', 'stayAway', locationEKID, OPENLATTICE_ID_FQN, 0]);
    return store.getIn(['longBeach', 'locations', 'people', stayAwayEKID]);
  }) || Map();
  const personEKID = person.getIn([OPENLATTICE_ID_FQN, 0]);

  const imageUrl = useSelector((store) => {
    const profilePic = store.getIn(['longBeach', 'locations', 'profilePictures', personEKID], Map());
    return getImageDataFromEntity(profilePic);
  });

  const goToProfile = useGoToPath(PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, personEKID));
  const dispatch = useDispatch();

  const handleViewProfile = () => {
    dispatch(clearProfile());
    dispatch(selectPerson(person));
    goToProfile();
  };

  const fullName = getLastFirstMiFromPerson(person, true);
  // $FlowFixMe
  const dob :string = getDobFromPerson(person, false, '---');
  const sex = person.getIn([PERSON_SEX_FQN, 0]);
  const race = person.getIn([PERSON_RACE_FQN, 0]);
  const { name, address } = getAddressFromLocation(result);
  let nameAndAddress = address;
  if (name && address) {
    nameAndAddress = `${name}\n${address}`;
  }

  return (
    <Card onClick={handleViewProfile}>
      <ResultSegment padding="sm" vertical>
        <ResultName bold uppercase>{fullName}</ResultName>
        <FlexRow>
          <Portrait imageUrl={imageUrl} height="90" width="72" />
          <ResultDetails>
            <Detail content={dob} icon={faBirthdayCake} />
            <Detail content={race} icon={faUser} />
            <Detail content={sex} icon={faVenusMars} />
            <Detail content={nameAndAddress} icon={faMapMarkerAltSlash} />
          </ResultDetails>
        </FlexRow>
      </ResultSegment>
    </Card>
  );
};

export default React.memo<Props>(LongBeachLocationResult);
