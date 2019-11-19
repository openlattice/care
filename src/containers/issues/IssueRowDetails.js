// @flow
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Map, get } from 'immutable';
import { Colors, Label } from 'lattice-ui-kit';

import { getIssueNeighbors, resetIssue } from './issue/IssueActions';
import {
  TITLE_FQN,
  PRIORITY_FQN,
  STATUS_FQN,
  CATEGORY_FQN,
  DESCRIPTION_FQN,
  OPENLATTICE_ID_FQN,
} from '../../edm/DataModelFqns';

const { NEUTRALS } = Colors;

const RowDetailsWrapper = styled.tr`
  outline: none;
  border-bottom: 1px solid ${NEUTRALS[4]};
`;

const ExpandedCell = styled.td.attrs(() => ({
  colSpan: 5
}))`
  padding: 10px;
  outline: none;
`;

const ExpandedCellContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 14px;
  min-height: 200px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  width: 100%;
`;

const LabelGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 5px 0;
`;

const LabelGroup = styled.div`
  flex: 1;
`;

type Props = {
  data :Map;
};

const IssueRowDetails = (props :Props) => {

  const { data } = props;
  const dispatch = useDispatch();

  const category = get(data, CATEGORY_FQN);
  const description = get(data, DESCRIPTION_FQN);
  const priority = get(data, PRIORITY_FQN);
  const status = get(data, STATUS_FQN) || 'Open';
  const title = get(data, TITLE_FQN);
  const issueEKID = get(data, OPENLATTICE_ID_FQN);

  useEffect(() => {
    dispatch(getIssueNeighbors(issueEKID));

    return () => dispatch(resetIssue());
  }, [dispatch, issueEKID]);

  return (
    <RowDetailsWrapper>
      <ExpandedCell>
        <ExpandedCellContent>
          <Title>{title}</Title>
          <LabelGrid>
            <LabelGroup>
              <Label subtle>Priority: </Label>
              <span>{priority}</span>
            </LabelGroup>
            <LabelGroup>
              <Label subtle>Status: </Label>
              <span>{status}</span>
            </LabelGroup>
            <LabelGroup>
              <Label subtle>Assignee: </Label>
              <span>{priority}</span>
            </LabelGroup>
            <LabelGroup>
              <Label subtle>Reporter: </Label>
              <span>{priority}</span>
            </LabelGroup>
            <LabelGroup>
              <Label subtle>Category: </Label>
              <span>{category}</span>
            </LabelGroup>
          </LabelGrid>
          <Label subtle>Description</Label>
          <div>{description}</div>
        </ExpandedCellContent>
      </ExpandedCell>
    </RowDetailsWrapper>
  );
};

export default IssueRowDetails;
