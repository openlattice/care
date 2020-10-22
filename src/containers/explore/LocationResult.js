// @flow
import React from 'react';

import {
  List,
  Map,
  getIn
} from 'immutable';
import {
  Card,
  CardSegment,
  Typography,
} from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import PersonLink from './styled/PersonLink';
import { DetailWrapper, WordBreak } from './styled';

import Address from '../../components/premium/address/Address';
import {
  LOCATION_ADDRESS_LINE_2_FQN,
  LOCATION_CITY_FQN,
  LOCATION_NAME_FQN,
  LOCATION_STATE_FQN,
  LOCATION_STREET_FQN,
  LOCATION_ZIP_FQN,
  TYPE_FQN,
} from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { formatCityStateZip } from '../../utils/AddressUtils';
import { getEntityKeyId } from '../../utils/DataUtils';

const { LOCATION_FQN } = APP_TYPES_FQNS;

type Props = {
  result :Map;
};

const LocationResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => {
    const peopleByHitEKID = store.getIn([
      'explore', LOCATION_FQN, 'peopleByHitEKID', entityKeyId
    ], List());
    return peopleByHitEKID
      .map((peopleEKID) => store.getIn(['explore', LOCATION_FQN, 'peopleByEKID', peopleEKID]));
  });

  const name = getIn(result, [LOCATION_NAME_FQN, 0]);
  const street = getIn(result, [LOCATION_STREET_FQN, 0]);
  const line2 = getIn(result, [LOCATION_ADDRESS_LINE_2_FQN, 0]);
  const city = getIn(result, [LOCATION_CITY_FQN, 0]);
  const state = getIn(result, [LOCATION_STATE_FQN, 0]);
  const zip = getIn(result, [LOCATION_ZIP_FQN, 0]);
  const type = getIn(result, [TYPE_FQN, 0]) || '---';
  const cityStateZip = formatCityStateZip(city, state, zip);

  return (
    <Card>
      <CardSegment padding="sm">
        <WordBreak>
          { name && <Typography variant="h5" component="h3">{name}</Typography> }
        </WordBreak>
        <DetailWrapper>
          <Typography component="span">Attached to: </Typography>
          <div>
            { people.map((person) => {
              const id = getEntityKeyId(person);
              return <PersonLink key={id} person={person} />;
            })}
          </div>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Address: </Typography>
          <Address
              cityStateZip={cityStateZip}
              line2={line2}
              street={street} />
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Type: </Typography>
          <Typography>{type}</Typography>
        </DetailWrapper>
      </CardSegment>
    </Card>
  );
};

export default LocationResult;
