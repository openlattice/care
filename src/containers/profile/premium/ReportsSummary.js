// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Models } from 'lattice';
import { List, Map } from 'immutable';
import { Card, CardSegment } from 'lattice-ui-kit';
import PercentBarChart from '../../../components/dashboard/charts/PercentBarChart';
import { countPropertyOccurrance } from './Utils';
import {
  OBSERVED_BEHAVIORS_FQN,
  DISPATCH_REASON_FQN,
  DISPOSITION_FQN,
} from '../../../edm/DataModelFqns';

const { FullyQualifiedName } = Models;

const H1 = styled.h1`
  display: flex;
  flex: 1;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  align-items: center;
`;

type Props = {
  reports :List<Map>;
};

class ReportsSummary extends PureComponent<Props> {

  countPropertyValues = (reports :List, propertyTypeFqn :FullyQualifiedName) :Map => {
    const total = reports.count();
    return countPropertyOccurrance(reports, propertyTypeFqn)
      .sortBy(count => count, (valueA, valueB) => valueB - valueA)
      .toArray()
      .map(([name, count]) => {
        const percent = Math.round((count / total) * 100);
        return { name, count, percent };
      });
  }

  renderBehaviorChart = () => {
    const { reports } = this.props;
    const total = reports.count();
    const data = this.countPropertyValues(reports, OBSERVED_BEHAVIORS_FQN);
    return (
      <CardSegment padding="sm" vertical>
        <H1>Behavior</H1>
        <PercentBarChart data={data} total={total} />
      </CardSegment>
    );
  }

  renderNatureOfCrisisChart = () => {
    const { reports } = this.props;
    const total = reports.count();
    const data = this.countPropertyValues(reports, DISPATCH_REASON_FQN);
    return (
      <CardSegment padding="sm" vertical>
        <H1>Nature of Crisis</H1>
        <PercentBarChart data={data} total={total} />
      </CardSegment>
    );
  }

  renderDispositionChart = () => {
    const { reports } = this.props;
    const total = reports.count();
    const data = this.countPropertyValues(reports, DISPOSITION_FQN);
    return (
      <CardSegment padding="sm" vertical>
        <H1>Disposition</H1>
        <PercentBarChart data={data} total={total} />
      </CardSegment>
    );
  }

  render() {
    return (
      <Card>
        { this.renderBehaviorChart() }
        { this.renderNatureOfCrisisChart() }
        { this.renderDispositionChart() }
      </Card>
    );
  }
}

export default ReportsSummary;
