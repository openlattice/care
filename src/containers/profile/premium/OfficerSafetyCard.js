// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import memoizeOne from 'memoize-one';
import { List, Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

import DashedList from './DashedList';
import BehaviorItem from './BehaviorItem';
import {
  ARMED_WITH_WEAPON_FQN,
  INJURIES_FQN,
  INJURIES_OTHER_FQN,
  OTHER_PERSON_INJURED_FQN,
  PERSON_INJURED_FQN,
  THREATENED_INDICATOR_FQN,
} from '../../../edm/DataModelFqns';
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
  min-height: 300px;
  min-width: 300px;
`;

type Props = {
  reports :List<Map>;
};

class OfficerSafetyCard extends Component<Props> {

  countSafetyIncidents = memoizeOne((reports :List) :Map => Map()
    .withMutations((mutable) => {
      reports.forEach((report) => {
        const injuryType = report.get(INJURIES_FQN, List()).toJS();
        const otherInjuryType = report.getIn([INJURIES_OTHER_FQN, 0], '');
        const injuredParties = report.get(PERSON_INJURED_FQN, List()).toJS();
        const otherInjuredPerson = report.getIn([OTHER_PERSON_INJURED_FQN, 0], '');

        const hadInjuries :boolean = (
          injuryType.length > 0
          || otherInjuryType.length > 0
          || injuredParties.length > 0
          || otherInjuredPerson.length > 0
        );

        const armedWithWeapon :boolean = report.getIn([ARMED_WITH_WEAPON_FQN, 0], false);
        const threatenedViolence :boolean = report.getIn([THREATENED_INDICATOR_FQN, 0], false);

        this.incrementSafteyIncident(mutable, ARMED_WITH_WEAPON, armedWithWeapon);
        this.incrementSafteyIncident(mutable, INJURED_PARTIES, threatenedViolence);
        this.incrementSafteyIncident(mutable, THREATENED_VIOLENCE, hadInjuries);
      });
    })
    .sortBy(count => count, (valueA, valueB) => valueB - valueA)
    .toKeyedSeq()
    .toArray());

  incrementSafteyIncident = (mutable :Map, incidentType :string, value :boolean) => {
    // increment if behavior exists
    if (value) {
      if (mutable.has(incidentType)) {
        mutable.update(incidentType, count => count + 1);
      }
      else {
        mutable.set(incidentType, 1);
      }
    }
  }

  render() {
    const { reports } = this.props;

    const safetyIncidentCounts = this.countSafetyIncidents(reports);
    const total = reports.count();

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
        <StyledCardSegment padding="sm">
          <DashedList>
            {
              safetyIncidentCounts.map(([name, count]) => (
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

export default OfficerSafetyCard;
