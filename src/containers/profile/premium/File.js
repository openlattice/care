// @flow
import React from 'react';

import styled from 'styled-components';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map, get, getIn } from 'immutable';
import {
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
} from '../../../edm/DataModelFqns';

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

type Props = {
  file :Map;
}
const File = ({ file } :Props) => {
  const fileData = getIn(file, [FILE_DATA_FQN, 0]);
  const name = getIn(file, [NAME_FQN, 0]);
  const labels = get(file, LABEL_FQN) || [];
  const datetime = getIn(file, [DATETIME_FQN, 0]);
  const date = formatAsDate(datetime);

  return (
    <li padding="sm">
      <HeaderRow>
        <MinWidth>
          <Typography>{name}</Typography>
          <Typography variant="caption" color="textSecondary">{date}</Typography>
        </MinWidth>
        <a href={fileData} download rel="noreferrer" target="_blank">
          <IconButton>
            <FontAwesomeIcon icon={faDownload} fixedWidth />
          </IconButton>
        </a>
      </HeaderRow>
      <div>
        {
          labels.sort().map((label) => <Tag key={label}>{label}</Tag>)
        }
      </div>
    </li>
  );
};

export default File;
