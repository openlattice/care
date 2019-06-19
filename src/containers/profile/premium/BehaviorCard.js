// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import memoizeOne from 'memoize-one';
import { List, Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadSideBrain } from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

import DashedList from './DashedList';
import BehaviorItem from './BehaviorItem';
import { OBSERVED_BEHAVIORS_FQN } from '../../../edm/DataModelFqns';

const H1 = styled.h1`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

const IconWrapper = styled.div`
  vertical-align: middle;
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  margin-right: 10px;
`;

const StyledCardSegment = styled(CardSegment)`
  min-width: 300px;
`;

type Props = {
  isLoading ? :boolean;
  reports ? :List<Map>;
};

// Do not re-render when reports do not change
class BehaviorCard extends PureComponent<Props> {
  static defaultProps = {
    isLoading: false,
    reports: List(),
  }

  countBehaviors = memoizeOne((reports :List) :Map => Map()
    .withMutations((mutable) => {
      reports.forEach((report) => {
        const behavior = report.getIn([OBSERVED_BEHAVIORS_FQN, 0], '');

        // increment if behavior exists
        if (mutable.has(behavior)) {
          mutable.update(behavior, count => count + 1);
        }

        // add new behaviors with names
        if (behavior && behavior.length) {
          mutable.set(behavior, 1);
        }
      });
    })
    .sortBy(count => count, (valueA, valueB) => valueB - valueA)
    .toKeyedSeq()
    .toArray());

  render() {
    const { isLoading, reports } = this.props;

    const behaviorCounts = this.countBehaviors(reports);
    const total = reports ? reports.count() : 0;

    return (
      <Card>
        <CardHeader mode="primary" padding="sm">
          <H1>
            <IconWrapper>
              <FontAwesomeIcon icon={faHeadSideBrain} fixedWidth />
            </IconWrapper>
            Behaviors
          </H1>
        </CardHeader>
        <StyledCardSegment padding="sm">
          <DashedList isLoading={isLoading}>
            {
              behaviorCounts.map(([name, count]) => (
                <BehaviorItem
                    key={name}
                    name={name}
                    count={count}
                    total={total} />
              ))
            }
          </DashedList>
        </StyledCardSegment>
      </Card>
    );
  }
}

export default BehaviorCard;
