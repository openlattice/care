// @flow
import React, { PureComponent } from 'react';
import memoizeOne from 'memoize-one';
import { Models } from 'lattice';
import { List, Map } from 'immutable';
import { Card, CardSegment } from 'lattice-ui-kit';
import { OBSERVED_BEHAVIORS_FQN } from '../../../edm/DataModelFqns';
import PercentBarChart from '../../../components/dashboard/charts/PercentBarChart';
import { countPropertyOccurrance } from './Utils';

const { FullyQualifiedName } = Models;

type Props = {
  reports :List<Map>;
};

class ReportsSummary extends PureComponent<Props> {

  /*
  [
    {
      name: 'behavior1',
      count: 1
    },
    {
      name: 'behavior2',
      count: 2
    }
  ]
  */

  countPropertyValues = memoizeOne((reports :List, propertyTypeFqn :FullyQualifiedName) :Map => {
    const total = reports.count();
    return countPropertyOccurrance(reports, propertyTypeFqn)
      .sortBy(count => count, (valueA, valueB) => valueB - valueA)
      .toArray()
      .map(([name, count]) => {
        const percent = Math.round((count / total) * 100);
        return { name, count, percent };
      });
  });

  renderBehaviorChart = () => {

  }

  renderNatureOfCrisisChart = () => {

  }

  renderDispositionChart = () => {

  }

  render() {
    const { reports } = this.props;
    const data = this.countPropertyValues(reports, OBSERVED_BEHAVIORS_FQN);
    const total = reports.count();
    return (
      <Card>
        <CardSegment padding="sm" vertical>
          <PercentBarChart data={data} total={total} />
        </CardSegment>
      </Card>
    );
  }
}

export default ReportsSummary;
