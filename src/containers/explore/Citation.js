// @flow
import React from 'react';

import styled from 'styled-components';
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
  DATE_TIME_FQN,
  EMPLOYEE_ID_FQN,
  OL_ID_FQN,
  ROLE_FQN,
} from '../../edm/DataModelFqns';
import { getEntityKeyId } from '../../utils/DataUtils';

const { formatAsDate } = DateTimeUtils;

const Span = styled.span`
  :not(:last-child)::after {
    content: ', ';
  }
`;

type Props = {
  employees :Map;
  people :Map;
  result :Map;
};

const Citation = ({
  employees,
  people,
  result,
} :Props) => {

  const datetime = getIn(result, [DATE_TIME_FQN, 0]);
  const reportDate = formatAsDate(datetime);
  const sorId = getIn(result, [OL_ID_FQN, 0]);

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
          <Typography component="span">Employee ID: </Typography>
          <div>
            { employees.map((person) => {
              const id = getEntityKeyId(person);
              const employeeId = getIn(person, [EMPLOYEE_ID_FQN, 0]);
              return <Span key={id}>{employeeId}</Span>;
            })}
          </div>
        </DetailWrapper>
      </CardSegment>
    </Card>
  );
};

export default Citation;
