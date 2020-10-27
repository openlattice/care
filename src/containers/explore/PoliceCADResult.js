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
  CATEGORY_FQN,
  CRIMINALJUSTICE_REPORT_NUMBER_FQN,
  DATETIME_END_FQN,
  DATETIME_REPORTED_FQN,
  DATETIME_START_FQN,
  OL_ID_FQN,
  STATUS_FQN,
  TYPE_FQN,
} from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId } from '../../utils/DataUtils';

const { formatAsDate } = DateTimeUtils;

const { POLICE_CAD_FQN } = APP_TYPES_FQNS;

type Props = {
  result :Map;
};

const PoliceCADResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => {
    const peopleByHitEKID = store.getIn([
      'explore', POLICE_CAD_FQN, 'peopleByHitEKID', entityKeyId
    ], List());
    return peopleByHitEKID
      .map((peopleEKID) => store.getIn(['explore', POLICE_CAD_FQN, 'peopleByEKID', peopleEKID]));
  });

  const category = getIn(result, [CATEGORY_FQN, 0]) || '---';
  const end = getIn(result, [DATETIME_END_FQN, 0]);
  const endDate = formatAsDate(end, '');
  const report = getIn(result, [DATETIME_REPORTED_FQN, 0]);
  const reportDate = formatAsDate(report);
  const reportNumber = getIn(result, [CRIMINALJUSTICE_REPORT_NUMBER_FQN, 0]);
  const sorId = getIn(result, [OL_ID_FQN, 0]);
  const start = getIn(result, [DATETIME_START_FQN, 0]);
  const startDate = formatAsDate(start, '');
  const status = getIn(result, [STATUS_FQN, 0]) || '---';
  const type = getIn(result, [TYPE_FQN, 0]);

  return (
    <Card>
      <CardSegment padding="sm">
        <WordBreak>
          <Typography variant="h5" component="h3">{sorId}</Typography>
          <Typography variant="caption" color="textSecondary">{reportDate}</Typography>
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
          <Typography component="span">Start/End: </Typography>
          <Typography>{`${startDate} - ${endDate}`}</Typography>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Record #: </Typography>
          <Typography>{reportNumber}</Typography>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Type: </Typography>
          <Typography>{type}</Typography>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Status: </Typography>
          <Typography>{status}</Typography>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Category: </Typography>
          <Typography>{category}</Typography>
        </DetailWrapper>
      </CardSegment>
    </Card>
  );
};

export default PoliceCADResult;
