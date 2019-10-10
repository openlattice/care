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
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';


import EditLinkButton from '../../../components/buttons/EditLinkButton';
import BehaviorItem from './BehaviorItem';
import Triggers from './Triggers';
import { OFFICER_SAFETY_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { DashedList, H1, IconWrapper } from '../../../components/layout';
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
import OfficerSafetyConcernsList from '../../../components/premium/officersafety/OfficerSafetyConcernsList';

const StyledCardSegment = styled(CardSegment)`
  min-height: 100px;
  min-width: 300px;
`;

type Props = {
  isLoading :boolean;
  match :Match;
  officerSafety :List<Map>;
  reports :List<Map>;
  showEdit :boolean;
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

  renderIncidentCounts = () => {
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
    const {
      isLoading,
      match,
      officerSafety,
      showEdit,
      triggers
    } = this.props;
    const headerMode = 'warning';
    return (
      <Card>
        <CardHeader mode={headerMode} padding="sm">
          <H1>
            <IconWrapper>
              <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth />
            </IconWrapper>
            Officer Safety
            { showEdit && <EditLinkButton mode="subtle" to={`${match.url}${EDIT_PATH}${OFFICER_SAFETY_PATH}`} /> }
          </H1>
        </CardHeader>
        <StyledCardSegment padding="sm" vertical>
          <OfficerSafetyConcernsList isLoading={isLoading} officerSafety={officerSafety} />
          <DashedList isLoading={isLoading}>
            { this.renderIncidentCounts() }
          </DashedList>
        </StyledCardSegment>
        <StyledCardSegment vertical padding="sm">
          <Triggers triggers={triggers} isLoading={isLoading} />
        </StyledCardSegment>
      </Card>
    );
  }
}

export default withRouter(OfficerSafetyCard);
