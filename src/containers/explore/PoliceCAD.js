// @flow
import React from 'react';

import {
  Map,
  getIn
} from 'immutable';
import {
  Card,
  CardSegment,
  Typography,
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';

import PersonLink from './styled/PersonLink';
import { DetailWrapper, WordBreak } from './styled';

import {
  CATEGORY_FQN,
  CRIMINALJUSTICE_REPORT_NUMBER_FQN,
  DATETIME_END_FQN,
  DATETIME_REPORTED_FQN,
  DATETIME_START_FQN,
  OL_ID_FQN,
  ROLE_FQN,
  STATUS_FQN,
  TYPE_FQN,
} from '../../edm/DataModelFqns';
import { getEntityKeyId } from '../../utils/DataUtils';

const { formatAsDate } = DateTimeUtils;

type Props = {
  result :Map;
  people :Map;
};

const PoliceCAD = ({
  result,
  people
} :Props) => {

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
              const personDetails = person.get('neighborDetails');
              const assocDetails = person.get('associationDetails');
              const assocId = getEntityKeyId(assocDetails);
              const role = assocDetails.getIn([ROLE_FQN, 0]);
              return <PersonLink key={assocId} person={personDetails} role={role} />;
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

export default PoliceCAD;
