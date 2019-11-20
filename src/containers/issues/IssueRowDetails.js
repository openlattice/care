// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Map, getIn } from 'immutable';
import {
  Button,
  Colors,
  Label,
  Spinner
} from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import { getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import {
  TITLE_FQN,
  PRIORITY_FQN,
  STATUS_FQN,
  CATEGORY_FQN,
  DESCRIPTION_FQN,
  PERSON_ID_FQN,
} from '../../edm/DataModelFqns';

const { NEUTRALS } = Colors;

const RowDetailsWrapper = styled.tr`
  outline: none;
  border-bottom: 1px solid ${NEUTRALS[4]};
`;

const ButtonGroup = styled.div`
  > button:not(:first-of-type) {
    margin-left: 10px;
  }
`;

const ExpandedCell = styled.td.attrs(() => ({
  colSpan: 5
}))`
  padding: 10px 10px 20px;
  outline: none;
`;

const ExpandedCellContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  min-height: 250px;
  overflow-wrap: break-word;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  width: 100%;
`;

const LabelGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 10px 0;
`;

const LabelGroup = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const IssueRowDetails = () => {

  const fetchState :RequestState = useSelector((store :Map) => store.getIn(['issues', 'issue', 'fetchState']));
  const assignee = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'assignee']));
  const issue = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'issue']));
  const reporter = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'reporter']));
  const subject = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'subject']));

  const assigneeName = getIn(assignee, [PERSON_ID_FQN, 0]);
  const category = getIn(issue, [CATEGORY_FQN, 0]);
  const description = getIn(issue, [DESCRIPTION_FQN, 0]);
  const priority = getIn(issue, [PRIORITY_FQN, 0]);
  const reporterName = getIn(reporter, [PERSON_ID_FQN, 0]);
  const status = getIn(issue, [STATUS_FQN, 0]) || 'Open';
  const title = getIn(issue, [TITLE_FQN, 0]);
  const subjectName = getLastFirstMiFromPerson(subject, true);

  return (
    <RowDetailsWrapper>
      <ExpandedCell>
        {
          fetchState === RequestStates.PENDING
            ? (
              <ExpandedCellContent>
                <Spinner size="2x" />
              </ExpandedCellContent>
            )
            : (
              <ExpandedCellContent>
                <LabelGroup>
                  <Label subtle>Subject: </Label>
                  <span>{subjectName}</span>
                </LabelGroup>
                <Title>{title}</Title>
                <ButtonGroup>
                  <Button>Edit</Button>
                  <Button>Resolve</Button>
                  <Button mode="primary">Take Action</Button>
                </ButtonGroup>
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
                    <span>{assigneeName}</span>
                  </LabelGroup>
                  <LabelGroup>
                    <Label subtle>Reporter: </Label>
                    <span>{reporterName}</span>
                  </LabelGroup>
                  <LabelGroup>
                    <Label subtle>Category: </Label>
                    <span>{category}</span>
                  </LabelGroup>
                </LabelGrid>
                <Label subtle>Description</Label>
                <div>{description}</div>
              </ExpandedCellContent>
            )
        }
      </ExpandedCell>
    </RowDetailsWrapper>
  );
};

export default IssueRowDetails;
