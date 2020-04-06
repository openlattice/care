// @flow
import React from 'react';

import { faInfoSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
  Label
} from 'lattice-ui-kit';

import IconDetail from '../styled/IconDetail';
import { PERSON_ID_FQN } from '../../../edm/DataModelFqns';
import { H1, IconWrapper } from '../../layout';
import { CardSkeleton } from '../../skeletons';

type Props = {
  isLoading ?:boolean;
  responsibleUser :Map;
}

const AboutPlanCard = (props :Props) => {
  const { isLoading, responsibleUser } = props;

  if (isLoading) {
    return <CardSkeleton />;
  }

  const content = responsibleUser.getIn([PERSON_ID_FQN, 0]) || '---';
  return (
    <Card>
      <CardHeader mode="default" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faInfoSquare} fixedWidth />
          </IconWrapper>
          About Plan
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Label subtle>Assigned Officer</Label>
        <IconDetail isLoading={isLoading} content={content} />
      </CardSegment>
    </Card>
  );
};

AboutPlanCard.defaultProps = {
  isLoading: false,
};

export default AboutPlanCard;
