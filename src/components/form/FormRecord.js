// @flow
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Button } from 'lattice-ui-kit';
import { Map } from 'immutable';

import {
  DATE_TIME_FQN,
  PERSON_ID_FQN,
} from '../../edm/DataModelFqns';
import { MEDIA_QUERY_MD, MEDIA_QUERY_LG } from '../../core/style/Sizes';

const StyledFormWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: flex-start;
  background: #ffffff;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  flex-direction: row;
  font-size: 14px;
  margin-bottom: 5px;
  padding: 20px;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    margin-bottom: 10px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    margin-bottom: 15px;
    font-size: 16px;
  }
`;

const RecordGrid = styled.div`
  display: grid;
  width: 100%;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

const ActionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
`;

const Bold = styled.b`
  font-weight: 600;
  color: #2e2e34;

  ::after {
    content: ": ";
  }
`;

const StyledDiv = styled.div`
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

type RecordProps = {
  label :string;
  time :string;
  email :string;
};
const Record = ({ label, time, email } :RecordProps) => (
  <div>
    <StyledDiv>
      <span>
        <Bold>{label}</Bold>
        {moment(time).format('MM/DD/YYYY h:mm A')}
      </span>
    </StyledDiv>
    <StyledDiv>
      <span>
        <Bold>By</Bold>
        {email}
      </span>
    </StyledDiv>
  </div>
);

type FormRecordProps = {
  lastUpdated :Map;
  onClickPrimary :() => void;
  onClickSecondary :() => void;
  primaryText ? :string;
  secondaryText ? :string;
  submitted :Map;
}
const FormRecord = ({
  lastUpdated,
  onClickPrimary,
  onClickSecondary,
  primaryText,
  secondaryText,
  submitted,
} :FormRecordProps) => {

  const submittedTime = submitted.getIn(['associationDetails', DATE_TIME_FQN, 0], '');
  const submittedEmail = submitted.getIn(['neighborDetails', PERSON_ID_FQN, 0], '');
  const lastTime = lastUpdated.getIn(['associationDetails', DATE_TIME_FQN, 0], '');
  const lastEmail = lastUpdated.getIn(['neighborDetails', PERSON_ID_FQN, 0], '');

  return (
    <StyledFormWrapper>
      <RecordGrid>
        <Record
            label="Submitted"
            time={submittedTime}
            email={submittedEmail} />
        { !lastUpdated.isEmpty()
          && (
            <Record
                label="Last Updated"
                time={lastTime}
                email={lastEmail} />
          )
        }
      </RecordGrid>
      <ActionGrid>
        {
          onClickPrimary
          && (
            <Button
                onClick={onClickPrimary}
                mode="primary">
              {primaryText}
            </Button>
          )
        }
        {
          onClickSecondary
          && (
            <Button
                onClick={onClickSecondary}
                mode="secondary">
              {secondaryText}
            </Button>
          )
        }
      </ActionGrid>
    </StyledFormWrapper>
  );
};

FormRecord.defaultProps = {
  primaryText: 'Edit',
  secondaryText: 'Delete'
};

export default FormRecord;
