// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

const IconWrapper = styled.div`
  vertical-align: middle;
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  margin-right: 5px;
`;

const H1 = styled.h1`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

const StyledCardSegment = styled(CardSegment)`
  min-height: 300px;
  min-width: 300px;
`;

type Props = {
};

type State = {
};

class BehaviorCard extends Component<Props, State> {
  state = {
  };

  render() {
    return (
      <Card>
        <CardHeader mode="warning" padding="sm">
          <H1>
            <IconWrapper>
              <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth />
            </IconWrapper>
            Officer Safety
          </H1>
        </CardHeader>
        <StyledCardSegment>

        </StyledCardSegment>
      </Card>
    );
  }
}

export default BehaviorCard;
