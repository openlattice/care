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
import { DateTimeUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import PersonLink from './styled/PersonLink';
import { DetailWrapper, WordBreak } from './styled';

import {
  CRIMINALJUSTICE_CASE_NUMBER_FQN,
  DATETIME_START_FQN,
  DESCRIPTION_FQN,
  OL_ID_FQN,
  TYPE_FQN,
} from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId } from '../../utils/DataUtils';

const { INCIDENT_FQN } = APP_TYPES_FQNS;

const { formatAsDate } = DateTimeUtils;

type Props = {
  result :Map;
};

const IncidentResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => {
    const peopleByHitEKID = store.getIn(['explore', INCIDENT_FQN, 'peopleByHitEKID', entityKeyId], List());
    return peopleByHitEKID.map((peopleEKID) => store.getIn(['explore', INCIDENT_FQN, 'peopleByEKID', peopleEKID]));
  });
  const caseNumber = getIn(result, [CRIMINALJUSTICE_CASE_NUMBER_FQN, 0]);
  const sorId = getIn(result, [OL_ID_FQN, 0]);
  const datetime = getIn(result, [DATETIME_START_FQN, 0]);
  const date = formatAsDate(datetime);
  const description = getIn(result, [DESCRIPTION_FQN, 0]) || '---';
  const type = getIn(result, [TYPE_FQN, 0]) || '---';

  return (
    <Card>
      <CardSegment padding="sm">
        <WordBreak>
          <Typography variant="h5" component="h3">{`${caseNumber || sorId}`}</Typography>
          <Typography variant="caption" color="textSecondary">{date}</Typography>
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
          <Typography component="span">Type: </Typography>
          <Typography>{type}</Typography>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Description: </Typography>
          <Typography>{description}</Typography>
        </DetailWrapper>
      </CardSegment>
    </Card>
  );
};

export default IncidentResult;
