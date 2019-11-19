// @flow
import React from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { get } from 'immutable';
import { Colors, StyleUtils, Tag } from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import {
  TITLE_FQN,
  PRIORITY_FQN,
  STATUS_FQN,
  DATE_TIME_FQN,
} from '../../edm/DataModelFqns';

const { NEUTRALS } = Colors;
const { getHoverStyles } = StyleUtils;

const CustomRowWrapper = styled.tr.attrs(() => ({ tabIndex: '1' }))`
  border-bottom: ${(props) => (props.expanded ? null : `1px solid ${NEUTRALS[4]}`)};
  outline: none;
  ${getHoverStyles};
`;

const CellContent = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledCell = styled.td`
  padding: 10px;
  text-align: ${(props) => props.align || 'left'};
  word-wrap: break-word;
`;

const ExpandedCell = styled.td.attrs(() => ({
  colSpan: 5
}))`
  padding: 10px;
  outline: none;
`;

const ExpandedCellContent = styled.div`
  display: flex;
  height: 200px;
  flex: 1;
`;

type Props = {
  data :any;
  expanded :boolean;
  setExpandedRowId :(id ?:string) => void;
};

const IssueRow = (props :Props) => {
  const {
    data,
    expanded,
    setExpandedRowId,
  } = props;
  const id = get(data, 'id');
  const title = get(data, TITLE_FQN);
  const priority = get(data, PRIORITY_FQN);
  const status = get(data, STATUS_FQN) || 'Open';
  const created = DateTime.fromISO(get(data, DATE_TIME_FQN, ''))
    .toLocaleString(DateTime.DATE_SHORT);

  const icon = expanded ? faChevronUp : faChevronDown;

  const onClick = () => {
    if (expanded) {
      setExpandedRowId();
    }
    else {
      setExpandedRowId(id);
    }
  };

  return (
    <>
      <CustomRowWrapper onClick={onClick} expanded={expanded}>
        <StyledCell>
          <CellContent>
            {title}
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            {priority}
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            { status && <Tag mode="neutral">{status}</Tag> }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            {created}
          </CellContent>
        </StyledCell>
        <StyledCell>
          <FontAwesomeIcon icon={icon} fixedWidth />
        </StyledCell>
      </CustomRowWrapper>
      {
        expanded && (
          <CustomRowWrapper>
            <ExpandedCell>
              <ExpandedCellContent />
            </ExpandedCell>
          </CustomRowWrapper>
        )
      }
    </>
  );
};

export default React.memo<Props>(IssueRow);
