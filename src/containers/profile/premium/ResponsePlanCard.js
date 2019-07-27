// @flow
import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Card,
  CardHeader,
  CardSegment,
  IconSplash,
  Spinner,
} from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardListCheck, faEdit } from '@fortawesome/pro-solid-svg-icons';
import { List } from 'immutable';

const IconWrapper = styled.span`
  vertical-align: middle;
  margin-right: 10px;
`;

const H1 = styled.h1`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

const EditButton = styled(Button)`
  margin-left: auto;
  padding: 2px;
`;

type Props = {
  isLoading ? :boolean;
  interactionStrategies :List;
};

const ResponsePlanCard = ({ isLoading, interactionStrategies } :Props) => (
  <Card>
    <CardHeader mode="primary" padding="sm">
      <H1>
        <IconWrapper>
          <FontAwesomeIcon icon={faClipboardListCheck} fixedWidth />
        </IconWrapper>
        Response Plan
        <EditButton mode="primary">
          <FontAwesomeIcon icon={faEdit} fixedWidth />
        </EditButton>
      </H1>
    </CardHeader>
    <CardSegment vertical padding="sm">
      { isLoading && <Spinner size="2x" /> }
      { (!isLoading && interactionStrategies.isEmpty()) && <IconSplash caption="No response plan." /> }
    </CardSegment>
  </Card>
);

ResponsePlanCard.defaultProps = {
  isLoading: false,
};

export default ResponsePlanCard;
