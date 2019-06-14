// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Map, List } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

const H1 = styled.h1`
  display: flex;
  flex: 1 0 auto;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

const StyledCardSegment = styled(CardSegment)`
  min-height: 300px;
`;

type Props = {
  reports :List<Map>;
};

type State = {
  behaviorRatios :Map;
};

class BehaviorCard extends Component<Props, State> {
  state = {
    behaviorRatios: Map()
  };

  calculateRatios = () => {
    const { reports } = this.props;
  }

  render() {
    return (
      <Card>
        <CardHeader mode="primary" padding="sm">
          <H1>
            Behaviors
          </H1>
        </CardHeader>
        <StyledCardSegment />
      </Card>
    );
  }
}

export default BehaviorCard;
