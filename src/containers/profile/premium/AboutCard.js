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
  faEdit,
  faClawMarks
} from '@fortawesome/pro-solid-svg-icons';
import { faUserHardHat } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import AboutDetail from './AboutDetail';
import * as FQN from '../../../edm/DataModelFqns';
import { inchesToFeetString } from '../../../utils/DataUtils';
import { getNameFromPerson } from '../../../utils/PersonUtils';
import LinkButton from '../../../components/buttons/LinkButton';
import { BASIC_PATH } from '../../../core/router/Routes';

const IconWrapper = styled.span`
  vertical-align: middle;
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

const EditButton = styled(LinkButton)`
  margin-left: auto;
  padding: 2px;
`;

const Name = styled(AboutDetail)`
  text-transform: uppercase;
  font-weight: 600;
`;

const Birthdate = styled(AboutDetail)`
  width: 50%;
`;

const AboutGrid = styled.div`
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

const AboutCard = (props :Props) => {

  const {
    isLoading,
    match,
    appearance,
    selectedPerson
  } = props;

  const formattedName = getNameFromPerson(selectedPerson);

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
          About
          <EditButton mode="primary" to={`${match.url}${BASIC_PATH}`}>
            <FontAwesomeIcon icon={faEdit} fixedWidth />
          </EditButton>
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Name content={formattedName} isLoading={isLoading} />
        <Birthdate content={formattedDob} isLoading={isLoading} />
      </CardSegment>
      <CardSegment vertical padding="sm">
        <Label subtle>Aliases</Label>
        <AboutDetail
            content={aliases}
            isLoading={isLoading} />
      </CardSegment>
      <CardSegment vertical padding="sm">
        <AboutGrid>
          <AboutDetail
              content={race}
              isLoading={isLoading}
              icon={faUser} />
          <AboutDetail
              content={sex}
              isLoading={isLoading}
              icon={faVenusMars} />
          <AboutDetail
              content={formattedHeight}
              isLoading={isLoading}
              icon={faRulerVertical} />
          <AboutDetail
              content={formattedWeight}
              isLoading={isLoading}
              icon={faWeightHanging} />
          <AboutDetail
              content={hairColor}
              isLoading={isLoading}
              icon={faUserHardHat} />
          <AboutDetail
              content={eyeColor}
              isLoading={isLoading}
              icon={faEye} />
          <AboutDetail
              content={scars}
              isLoading={isLoading}
              icon={faClawMarks} />
        </AboutGrid>
      </CardSegment>
    </Card>
  );
};

export default withRouter(AboutCard);
