// @flow
import React, { PureComponent } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Models } from 'lattice';
import { Card, CardSegment, StyleUtils } from 'lattice-ui-kit';

import { countPropertyOccurrance, countSafetyIncidents } from './Utils';

import ProfileBarChart from '../../../components/dashboard/charts/ProfileBarChart';
import { Header } from '../../../components/layout';
import {
  OBSERVED_BEHAVIORS_FQN,
} from '../../../edm/DataModelFqns';
import { BEHAVIOR_LABEL_MAP } from '../../reports/crisis/schemas/v1/constants';

const { FullyQualifiedName } = Models;
const { media } = StyleUtils;

const BehaviorAndSafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  overflow: hidden;
  ${media.desktop`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `}
`;

type Props = {
  reports :List<Map>;
  isLoading ?:boolean;
};

class ReportsSummary extends PureComponent<Props> {
  static defaultProps = {
    isLoading: false
  };

  countPropertyValues = (reports :List, propertyTypeFqn :FullyQualifiedName) :Object[] => {
    return countPropertyOccurrance(reports, propertyTypeFqn)
      .sortBy((count) => count, (valueA, valueB) => valueB - valueA)
      .toArray()
      .map(([name, count]) => ({ name, count }));
  }

  renderBehaviorChart = () => {
    const { reports } = this.props;
    const data = this.countPropertyValues(reports, OBSERVED_BEHAVIORS_FQN);
    const formattedData = data.map((datum) => {
      const { name } = datum;
      const transformedName = BEHAVIOR_LABEL_MAP[name] || name;
      return { ...datum, name: transformedName };
    }).slice(0, 3);

    return (
      <CardSegment vertical>
        <Header>Top Behaviors</Header>
        <ProfileBarChart data={formattedData} />
      </CardSegment>
    );
  }

  renderNatureOfCrisisChart = () => {
    const { reports } = this.props;

    const safetyIncidentCounts = countSafetyIncidents(reports).slice(0, 3);
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
