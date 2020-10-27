// @flow
import React from 'react';

import styled from 'styled-components';
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
  DATE_TIME_FQN,
  EMPLOYEE_ID_FQN,
  OL_ID_FQN,
} from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId } from '../../utils/DataUtils';

const { formatAsDate } = DateTimeUtils;

const { CITATION_FQN } = APP_TYPES_FQNS;

const Span = styled.span`
  :not(:last-child)::after {
    content: ', ';
  }
`;

type Props = {
  result :Map;
};

const CitationResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => {
    const peopleByHitEKID = store.getIn([
      'explore', CITATION_FQN, 'peopleByHitEKID', entityKeyId
    ], List());
    return peopleByHitEKID
      .map((peopleEKID) => store.getIn(['explore', CITATION_FQN, 'peopleByEKID', peopleEKID]));
  });
  const employees = useSelector((store) => {
    const employeesByHitEKID = store.getIn([
      'explore', CITATION_FQN, 'employeesByHitEKID', entityKeyId
    ], List());
    return employeesByHitEKID
      .map((employeesEKID) => store.getIn(['explore', CITATION_FQN, 'employeesByEKID', employeesEKID]));
  });

  const report = getIn(result, [DATE_TIME_FQN, 0]);
  const reportDate = formatAsDate(report);
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
              const id = getEntityKeyId(person);
              return <PersonLink key={id} person={person} />;
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

export default CitationResult;
