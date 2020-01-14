// @flow

import React from 'react';

import styled from 'styled-components';
import {
  faBirthdayCake,
  faMapMarkerAltSlash,
  faUser,
  faVenusMars
} from '@fortawesome/pro-solid-svg-icons';
import { Map } from 'immutable';
import { Constants } from 'lattice';
import {
  Card,
  CardSegment,
} from 'lattice-ui-kit';
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
import { media } from '../../utils/StyleUtils';

const { OPENLATTICE_ID_FQN } = Constants;

const StyledSegment = styled(CardSegment)`
  ${media.phone`
    flex-direction: column;
    padding: 10px 15px;
  `}
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 16px;
  margin: 0 30px;
  min-width: 0;
  ${media.phone`
    font-size: 12px;
    margin: 0 10px;
  `}
`;

const Name = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  ${media.phone`
    font-size: 16px;
  `}
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

type Props = {
  result :Map;
}

const PersonResult = (props :Props) => {

  const { result } = props;

  const personEKID = result.getIn([OPENLATTICE_ID_FQN, 0]);
  const stayAwayLocation = useSelector((store) => {
    const stayAwayEKID = store.getIn(['longBeach', 'people', 'stayAway', personEKID, OPENLATTICE_ID_FQN, 0]);
    return store.getIn(['longBeach', 'people', 'stayAwayLocations', stayAwayEKID]);
  }) || Map();

  const imageUrl = useSelector((store) => {
    const profilePic = store.getIn(['longBeach', 'people', 'profilePictures', personEKID], Map());
    return getImageDataFromEntity(profilePic);
  });

  const goToProfile = useGoToPath(PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, personEKID));
  const dispatch = useDispatch();

  const handleViewProfile = () => {
    dispatch(clearProfile());
    dispatch(selectPerson(result));
    goToProfile();
  };

  const fullName = getLastFirstMiFromPerson(result, true);
  // $FlowFixMe
  const dob :string = getDobFromPerson(result, false, '---');
  const sex = result.getIn([PERSON_SEX_FQN, 0]);
  const race = result.getIn([PERSON_RACE_FQN, 0]);
  const { name, address } = getAddressFromLocation(stayAwayLocation);
  let nameAndAddress = address;
  if (name && address) {
    nameAndAddress = `${name}\n${address}`;
  }

  return (
    <Card onClick={handleViewProfile}>
      <StyledSegment padding="sm" vertical>
        <Name bold uppercase>{fullName}</Name>
        <FlexRow>
          <Portrait imageUrl={imageUrl} height="90" width="72" />
          <Details>
            {/* TODO: Fetch stayAway and warrant flags */}
            <Detail content={dob} icon={faBirthdayCake} />
            <Detail content={race} icon={faUser} />
            <Detail content={sex} icon={faVenusMars} />
            <Detail content={nameAndAddress} icon={faMapMarkerAltSlash} />
          </Details>
        </FlexRow>
      </StyledSegment>
    </Card>
  );
};

export default React.memo<Props>(PersonResult);
