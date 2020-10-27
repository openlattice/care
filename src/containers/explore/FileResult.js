// @flow
import React from 'react';

import styled from 'styled-components';
import { faDownload } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  List,
  Map,
  get,
  getIn
} from 'immutable';
import {
  Card,
  CardSegment,
  IconButton,
  Tag,
  Typography,
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import PersonLink from './styled/PersonLink';
import { WordBreak } from './styled';

import {
  DATETIME_FQN,
  FILE_DATA_FQN,
  LABEL_FQN,
  NAME_FQN,
} from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId } from '../../utils/DataUtils';

const { FILE_FQN } = APP_TYPES_FQNS;

const { formatAsDate } = DateTimeUtils;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const AttachedWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  > span {
    min-width: 100px;
  }
`;

type Props = {
  result :Map;
};

const FileResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => {
    const peopleByHitEKID = store.getIn(['explore', FILE_FQN, 'peopleByHitEKID', entityKeyId], List());
    return peopleByHitEKID.map((peopleEKID) => store.getIn(['explore', FILE_FQN, 'peopleByEKID', peopleEKID]));
  });
  const fileData = getIn(result, [FILE_DATA_FQN, 0]);
  const name = getIn(result, [NAME_FQN, 0]);
  const labels = get(result, LABEL_FQN) || [];
  const datetime = getIn(result, [DATETIME_FQN, 0]);
  const date = formatAsDate(datetime);

  return (
    <Card>
      <CardSegment padding="sm">
        <HeaderRow>
          <WordBreak>
            <Typography variant="h5" component="h3">{name}</Typography>
            <Typography variant="caption" color="textSecondary">{date}</Typography>
          </WordBreak>
          <a href={fileData} download rel="noreferrer" target="_blank">
            <IconButton>
              <FontAwesomeIcon icon={faDownload} fixedWidth />
            </IconButton>
          </a>
        </HeaderRow>
        <AttachedWrapper>
          <Typography component="span">Attached to: </Typography>
          <div>
            { people.map((person) => {
              const id = getEntityKeyId(person);
              return <PersonLink key={id} person={person} />;
            })}
          </div>
        </AttachedWrapper>
        <div>
          {
            labels.sort().map((label) => <Tag key={label}>{label}</Tag>)
          }
        </div>
      </CardSegment>
    </Card>
  );
};

export default FileResult;
