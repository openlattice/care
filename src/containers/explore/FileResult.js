import React from 'react';

import styled from 'styled-components';
import { faArrowToBottom } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, getIn } from 'immutable';
import {
  Card,
  CardSegment,
  IconButton,
  Tag,
  Typography,
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';

import {
  DATETIME_FQN,
  FILE_DATA_FQN,
  LABEL_FQN,
  NAME_FQN,
  TYPE_FQN
} from '../../edm/DataModelFqns';

const { formatAsDate } = DateTimeUtils;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileResult = ({ result }) => {
  const fileData = getIn(result, [FILE_DATA_FQN, 0]);
  const type = getIn(result, [TYPE_FQN, 0]);
  const name = getIn(result, [NAME_FQN, 0]);
  const labels = get(result, LABEL_FQN) || [];
  const datetime = getIn(result, [DATETIME_FQN, 0]);
  const date = formatAsDate(datetime);

  return (
    <Card>
      <CardSegment padding="sm">
        <Row>
          <div>
            <Typography variant="h4">{name}</Typography>
            <Typography variant="caption">{date}</Typography>
          </div>
          <a href={fileData} download rel="noreferrer" target="_blank">
            <IconButton>
              <FontAwesomeIcon icon={faArrowToBottom} fixedWidth />
            </IconButton>
          </a>
        </Row>
        {/* <Typography variant="h4">{type}</Typography> */}
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
