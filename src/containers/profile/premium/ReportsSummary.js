// @flow
import React, { PureComponent } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Card, CardSegment } from 'lattice-ui-kit';

import ProfileBarChart from '../../../components/dashboard/charts/ProfileBarChart';
import { Header } from '../../../components/layout';

// do not use fr units in css grid for recharts
// https://github.com/recharts/recharts/issues/1423
const BehaviorAndSafetyGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  overflow: hidden;
  flex: 1 0 auto;

  @media (max-width: 64em) {
    grid-template-columns: 100%;
  }

  @media (min-width: 64em) {
    grid-template-columns: calc(50% - 10px) calc(50% - 10px);
  }
`;

type Props = {
  safetySummary :List<Map>;
  behaviorSummary :List<Map>;
  isLoading ?:boolean;
};

class ReportsSummary extends PureComponent<Props> {
  static defaultProps = {
    isLoading: false
  };

  renderBehaviorChart = () => {
    const { behaviorSummary } = this.props;
    const formattedData = behaviorSummary.toJS().slice(0, 3);

    return (
      <CardSegment vertical>
        <Header>Top Behaviors</Header>
        <ProfileBarChart data={formattedData} />
      </CardSegment>
    );
  }

  renderNatureOfCrisisChart = () => {
    const { safetySummary } = this.props;

    const safetyIncidentCounts = safetySummary.toJS().slice(0, 3);
    return (
      <CardSegment vertical>
        <Header>Top Safety Concerns</Header>
        <ProfileBarChart data={safetyIncidentCounts} />
      </CardSegment>
    );
  }

  render() {
    const { isLoading } = this.props;
    return isLoading
      ? null
      : (
        <BehaviorAndSafetyGrid>
          <Card>
            { this.renderBehaviorChart() }
          </Card>
          <Card>
            { this.renderNatureOfCrisisChart() }
          </Card>
        </BehaviorAndSafetyGrid>
      );
  }
}

export default ReportsSummary;
