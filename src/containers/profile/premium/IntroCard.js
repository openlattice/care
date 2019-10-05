// @flow

import React from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import {
  Card,
  CardSegment,
  CardHeader,
  Label,
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import {
  faEye,
  faRulerVertical,
  faUser,
  faVenusMars,
  faWeightHanging,
  faClawMarks
} from '@fortawesome/pro-solid-svg-icons';
import { faUserHardHat } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import Detail from '../../../components/premium/styled/Detail';
import * as FQN from '../../../edm/DataModelFqns';
import { inchesToFeetString } from '../../../utils/DataUtils';
import { getLastFirstMiFromPerson } from '../../../utils/PersonUtils';
import EditLinkButton from '../../../components/buttons/EditLinkButton';
import { BASIC_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { H1, IconWrapper } from '../../../components/layout';

const Name = styled(Detail)`
  text-transform: uppercase;
  font-weight: 600;
`;

const Birthdate = styled(Detail)`
  width: 50%;
`;

const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;

  > div:nth-child(-n + 2),
  > div:last-child {
    grid-column: auto / span 2;
  };
`;

type Props = {
  match :Match;
  appearance :Map;
  selectedPerson :Map;
  isLoading :boolean;
};

const IntroCard = (props :Props) => {

  const {
    isLoading,
    match,
    appearance,
    selectedPerson
  } = props;

  const formattedName = getLastFirstMiFromPerson(selectedPerson);

  const rawDob = selectedPerson.getIn([FQN.PERSON_DOB_FQN, 0], '');
  const race = selectedPerson.getIn([FQN.PERSON_RACE_FQN, 0], '');
  const sex = selectedPerson.getIn([FQN.PERSON_SEX_FQN, 0], '');
  const aliases = selectedPerson.get(FQN.PERSON_NICK_NAME_FQN, []).join(', ');
  let formattedDob = '';

  if (rawDob) {
    formattedDob = DateTime.fromISO(rawDob).toLocaleString(DateTime.DATE_SHORT);
  }

  const physicalAppearance = appearance.get('physicalAppearance', Map());
  const identifyingCharacteristics = appearance.get('identifyingCharacteristics', Map());

  const scars = identifyingCharacteristics.getIn([FQN.DESCRIPTION_FQN], '');

  const hairColor = physicalAppearance.getIn([FQN.HAIR_COLOR_FQN, 0], '');
  const eyeColor = physicalAppearance.getIn([FQN.EYE_COLOR_FQN, 0], '');
  const height = physicalAppearance.getIn([FQN.HEIGHT_FQN, 0]);
  const weight = physicalAppearance.getIn([FQN.WEIGHT_FQN, 0]);

  const formattedHeight = height ? inchesToFeetString(height) : '';
  const formattedWeight = weight ? `${weight} lbs` : '';

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faUser} fixedWidth />
          </IconWrapper>
          Intro
          <EditLinkButton mode="primary" to={`${match.url}${EDIT_PATH}${BASIC_PATH}`} />
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Name content={formattedName} isLoading={isLoading} />
        <Birthdate content={formattedDob} isLoading={isLoading} />
      </CardSegment>
      <CardSegment vertical padding="sm">
        <Label subtle>Aliases</Label>
        <Detail
            content={aliases}
            isLoading={isLoading} />
      </CardSegment>
      <CardSegment vertical padding="sm">
        <IntroGrid>
          <Detail
              content={race}
              isLoading={isLoading}
              icon={faUser} />
          <Detail
              content={sex}
              isLoading={isLoading}
              icon={faVenusMars} />
          <Detail
              content={formattedHeight}
              isLoading={isLoading}
              icon={faRulerVertical} />
          <Detail
              content={formattedWeight}
              isLoading={isLoading}
              icon={faWeightHanging} />
          <Detail
              content={hairColor}
              isLoading={isLoading}
              icon={faUserHardHat} />
          <Detail
              content={eyeColor}
              isLoading={isLoading}
              icon={faEye} />
          <Detail
              content={scars}
              isLoading={isLoading}
              icon={faClawMarks} />
        </IntroGrid>
      </CardSegment>
    </Card>
  );
};

export default withRouter(IntroCard);
