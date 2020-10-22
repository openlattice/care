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

import { DESCRIPTION_FQN } from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId } from '../../utils/DataUtils';

const { IDENTIFYING_CHARACTERISTICS_FQN } = APP_TYPES_FQNS;

type Props = {
  result :Map;
};

const IdentifyingCharacteristicsResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => {
    const peopleByHitEKID = store.getIn([
      'explore', IDENTIFYING_CHARACTERISTICS_FQN, 'peopleByHitEKID', entityKeyId
    ], List());
    return peopleByHitEKID
      .map((peopleEKID) => store.getIn(['explore', IDENTIFYING_CHARACTERISTICS_FQN, 'peopleByEKID', peopleEKID]));
  });

  const description = getIn(result, [DESCRIPTION_FQN, 0]);

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
          <Typography component="span">Description: </Typography>
          <Typography>{description}</Typography>
        </DetailWrapper>
      </CardSegment>
    </Card>
  );
};

export default IdentifyingCharacteristicsResult;
