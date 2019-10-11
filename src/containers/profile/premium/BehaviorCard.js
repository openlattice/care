// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { List, Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadSideBrain } from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

import { DashedList, H1, IconWrapper } from '../../../components/layout';
import BehaviorItem from './BehaviorItem';
import { OBSERVED_BEHAVIORS_FQN } from '../../../edm/DataModelFqns';
import { countPropertyOccurrance } from './Utils';

const StyledCardSegment = styled(CardSegment)`
  min-width: 300px;
`;

type Props = {
  isLoading ? :boolean;
  reports ? :List<Map>;
};

class BehaviorCard extends PureComponent<Props> {
  static defaultProps = {
    isLoading: false,
    reports: List(),
  }

  countBehaviors = (reports :List) :Map => countPropertyOccurrance(reports, OBSERVED_BEHAVIORS_FQN)
    .sortBy((count) => count, (valueA, valueB) => valueB - valueA)
    .toKeyedSeq()
    .toArray();

  renderItems = () => {
    const { isLoading, reports } = this.props;

    if (!isLoading) {
      const behaviorCounts = this.countBehaviors(reports);
      const total = reports ? reports.count() : 0;
      return (
        <>
          {
            behaviorCounts.map(([name, count]) => (
              <BehaviorItem
                  key={name}
                  name={name}
                  count={count}
                  total={total} />
            ))
          }
        </>
      );
    }

    return null;
  }

  render() {
    const { isLoading } = this.props;

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
            { this.renderItems() }
          </DashedList>
        </StyledCardSegment>
      </Card>
    );
  }
}

export default BehaviorCard;
