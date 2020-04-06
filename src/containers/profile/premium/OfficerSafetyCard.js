// @flow
import React, { useMemo } from 'react';

import styled from 'styled-components';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment
} from 'lattice-ui-kit';

import BehaviorItem from './BehaviorItem';
import Triggers from './Triggers';
import { countSafetyIncidents } from './Utils';

import OfficerSafetyConcernsList from '../../../components/premium/officersafety/OfficerSafetyConcernsList';
import {
  DashedList,
  H1,
  IconWrapper,
} from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';

const StyledCardSegment = styled(CardSegment)`
  min-height: 100px;
  min-width: 300px;
`;

type Props = {
  isLoading ?:boolean;
  officerSafety :List<Map>;
  reports :List<Map>;
  triggers :List<Map>;
};

const OfficerSafetyCard = (props :Props) => {

  const {
    isLoading,
    officerSafety,
    reports,
    triggers,
  } = props;

  const safetyIncidentCounts = useMemo(() => countSafetyIncidents(reports), [reports]);
  const total = reports.count();

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth />
          </IconWrapper>
          Officer Safety
        </H1>
      </CardHeader>
      <StyledCardSegment padding="sm" vertical>
        <OfficerSafetyConcernsList isLoading={isLoading} officerSafety={officerSafety} />
        <DashedList isLoading={isLoading}>
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
      <StyledCardSegment vertical padding="sm">
        <Triggers triggers={triggers} isLoading={isLoading} />
      </StyledCardSegment>
    </Card>
  );
};

OfficerSafetyCard.defaultProps = {
  isLoading: false
};

export default OfficerSafetyCard;
