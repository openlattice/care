// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { List, Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardHeader,
  CardSegment
} from 'lattice-ui-kit';

import DashedList from './DashedList';
import BehaviorItem from './BehaviorItem';
import Triggers from './Triggers';
import {
  ARMED_WITH_WEAPON_FQN,
  INJURIES_FQN,
  INJURIES_OTHER_FQN,
  OTHER_PERSON_INJURED_FQN,
  PERSON_INJURED_FQN,
  THREATENED_INDICATOR_FQN,
} from '../../../edm/DataModelFqns';
import { incrementValueAtKey } from './Utils';
import {
  ARMED_WITH_WEAPON,
  INJURED_PARTIES,
  THREATENED_VIOLENCE,
} from './constants';

const IconWrapper = styled.div`
  vertical-align: middle;
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
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

const StyledCardSegment = styled(CardSegment)`
  min-height: 100px;
  min-width: 300px;
`;

type Props = {
  isLoading :boolean;
  reports :List<Map>;
  triggers :List<Map>;
};

class OfficerSafetyCard extends PureComponent<Props> {

  countSafetyIncidents = (reports :List) :Map => Map()
    .withMutations((mutable) => {
      reports.forEach((report) => {
        const injuryType = report.get(INJURIES_FQN, List());
        const injuredParties = report.get(PERSON_INJURED_FQN, List());
        const otherInjuryType = report.getIn([INJURIES_OTHER_FQN, 0], '');
        const otherInjuredPerson = report.getIn([OTHER_PERSON_INJURED_FQN, 0], '');

        const hadInjuries :boolean = (
          injuryType.count() > 0
          || injuredParties.count() > 0
          || otherInjuryType.length > 0
          || otherInjuredPerson.length > 0
        );

        const armedWithWeapon :boolean = report.getIn([ARMED_WITH_WEAPON_FQN, 0], false);
        const threatenedViolence :boolean = report.getIn([THREATENED_INDICATOR_FQN, 0], false);

        incrementValueAtKey(mutable, ARMED_WITH_WEAPON, armedWithWeapon);
        incrementValueAtKey(mutable, INJURED_PARTIES, threatenedViolence);
        incrementValueAtKey(mutable, THREATENED_VIOLENCE, hadInjuries);
      });
    })
    .sortBy(count => count, (valueA, valueB) => valueB - valueA)
    .toKeyedSeq()
    .toArray();

  renderItems = () => {
    const { isLoading, reports } = this.props;

    if (!isLoading) {
      const safetyIncidentCounts = this.countSafetyIncidents(reports);
      const total = reports ? reports.count() : 0;
      return (
        <>
          {
            safetyIncidentCounts.map(([name, count]) => (
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
    const { isLoading, reports, triggers } = this.props;
    const total = reports.count();
    const headerMode = (total && !isLoading) ? 'warning' : 'default';
    return (
      <Card>
        <CardHeader mode={headerMode} padding="sm">
          <H1>
            <IconWrapper>
              <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth />
            </IconWrapper>
            Officer Safety
          </H1>
        </CardHeader>
        <StyledCardSegment padding="sm">
          <DashedList isLoading={isLoading}>
            { this.renderItems() }
          </DashedList>
        </StyledCardSegment>
        <StyledCardSegment vertical padding="sm">
          <Triggers triggers={triggers} isLoading={isLoading} />
        </StyledCardSegment>
      </Card>
    );
  }
}

export default OfficerSafetyCard;
