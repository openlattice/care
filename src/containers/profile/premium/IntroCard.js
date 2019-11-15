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
import EditLinkButton from '../../../components/buttons/EditLinkButton';
import RequestChangeButton from '../../../components/buttons/RequestChangeButton';
import { inchesToFeetString } from '../../../utils/DataUtils';
import { getLastFirstMiFromPerson } from '../../../utils/PersonUtils';
import { BASIC_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { H1, HeaderActions, IconWrapper } from '../../../components/layout';
import { COMPONENTS } from '../../inbox/request/constants';
import * as FQN from '../../../edm/DataModelFqns';

const { BASIC_INFORMATION } = COMPONENTS;

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
  appearance :Map;
  isLoading :boolean;
  match :Match;
  scars :Map;
  selectedPerson :Map;
  showEdit :boolean;
};

const IntroCard = (props :Props) => {

  const {
    appearance,
    isLoading,
    match,
    scars,
    selectedPerson,
    showEdit,
  } = props;

  const formattedName = getLastFirstMiFromPerson(selectedPerson, true);

  const rawDob = selectedPerson.getIn([FQN.PERSON_DOB_FQN, 0], '');
  const race = selectedPerson.getIn([FQN.PERSON_RACE_FQN, 0], '');
  const sex = selectedPerson.getIn([FQN.PERSON_SEX_FQN, 0], '');
  const aliases = selectedPerson.get(FQN.PERSON_NICK_NAME_FQN, []).join(', ');
  let formattedDob = '';

  if (rawDob) {
    formattedDob = DateTime.fromISO(rawDob).toLocaleString(DateTime.DATE_SHORT);
  }

  const scarsMarksTattoos = scars.getIn([FQN.DESCRIPTION_FQN], '');

  const hairColor = appearance.getIn([FQN.HAIR_COLOR_FQN, 0], '');
  const eyeColor = appearance.getIn([FQN.EYE_COLOR_FQN, 0], '');
  const height = appearance.getIn([FQN.HEIGHT_FQN, 0]);
  const weight = appearance.getIn([FQN.WEIGHT_FQN, 0]);

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
          <HeaderActions>
            { showEdit && <EditLinkButton mode="primary" to={`${match.url}${EDIT_PATH}${BASIC_PATH}`} /> }
            <RequestChangeButton defaultComponent={BASIC_INFORMATION} mode="primary" />
          </HeaderActions>
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
              content={scarsMarksTattoos}
              isLoading={isLoading}
              icon={faClawMarks} />
        </IntroGrid>
      </CardSegment>
    </Card>
  );
};

export default withRouter(IntroCard);
