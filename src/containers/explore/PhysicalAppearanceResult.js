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
import { DetailWrapper } from './styled';

import {
  EYE_COLOR_FQN,
  HAIR_COLOR_FQN,
  HEIGHT_FQN,
  WEIGHT_FQN,
} from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId, inchesToFeetString } from '../../utils/DataUtils';

const { PHYSICAL_APPEARANCE_FQN } = APP_TYPES_FQNS;

type Props = {
  result :Map;
};

const PhysicalAppearanceResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => {
    const peopleByHitEKID = store.getIn([
      'explore', PHYSICAL_APPEARANCE_FQN, 'peopleByHitEKID', entityKeyId
    ], List());
    return peopleByHitEKID
      .map((peopleEKID) => store.getIn(['explore', PHYSICAL_APPEARANCE_FQN, 'peopleByEKID', peopleEKID]));
  });

  const eyeColor = getIn(result, [EYE_COLOR_FQN, 0]);
  const hairColor = getIn(result, [HAIR_COLOR_FQN, 0]);
  const weight = getIn(result, [WEIGHT_FQN, 0]);
  const height = getIn(result, [HEIGHT_FQN, 0]);

  const formattedHeight = height ? inchesToFeetString(height) : '---';
  const formattedWeight = weight ? `${weight} lbs` : '---';

  return (
    <Card>
      <CardSegment padding="sm">
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
          <Typography component="span">Height: </Typography>
          <Typography>{formattedHeight}</Typography>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Weight: </Typography>
          <Typography>{formattedWeight}</Typography>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Eye Color: </Typography>
          <Typography>{eyeColor}</Typography>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Hair Color: </Typography>
          <Typography>{hairColor}</Typography>
        </DetailWrapper>
      </CardSegment>
    </Card>
  );
};

export default PhysicalAppearanceResult;
