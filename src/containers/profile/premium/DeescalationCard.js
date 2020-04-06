// @flow
import React from 'react';

import { faTheaterMasks } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

import SpecificTechniques from './SpecificTechniques';

import {
  H1,
  IconWrapper,
} from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';

type Props = {
  isLoading ?:boolean;
  techniques :List<Map>;
};

const DeescalationCard = (props :Props) => {
  const {
    isLoading,
    techniques
  } = props;

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faTheaterMasks} fixedWidth />
          </IconWrapper>
          De-escalation
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <SpecificTechniques isLoading={isLoading} techniques={techniques} />
      </CardSegment>
    </Card>
  );
};

DeescalationCard.defaultProps = {
  isLoading: false,
};

export default DeescalationCard;
