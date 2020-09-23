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

import {
  CRIMINALJUSTICE_CASE_NUMBER_FQN,
  DATETIME_START_FQN,
  DESCRIPTION_FQN,
} from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId } from '../../utils/DataUtils';

const { INCIDENT_FQN } = APP_TYPES_FQNS;

const { formatAsDate } = DateTimeUtils;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const MinWidth = styled.div`
  word-break: break-all;
  min-width: 0;
`;

const DetailWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  > span {
    min-width: 100px;
  }
`;

type Props = {
  result :Map;
};

const IncidentResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => {
    const peopleByIncidentEKID = store.getIn(['explore', INCIDENT_FQN, 'peopleByIncidentEKID', entityKeyId], List());
    return peopleByIncidentEKID.map((peopleEKID) => store.getIn(['explore', INCIDENT_FQN, 'peopleByEKID', peopleEKID]));
  });
  const caseNumber = getIn(result, [CRIMINALJUSTICE_CASE_NUMBER_FQN, 0]);
  const datetime = getIn(result, [DATETIME_START_FQN, 0]);
  const date = formatAsDate(datetime);
  const description = getIn(result, [DESCRIPTION_FQN, 0]);

  return (
    <Card>
      <CardSegment padding="sm">
        <HeaderRow>
          <MinWidth>
            <Typography variant="h5" component="h3">{`#${caseNumber}`}</Typography>
            <Typography variant="caption" color="textSecondary">{date}</Typography>
          </MinWidth>
        </HeaderRow>
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

export default IncidentResult;
