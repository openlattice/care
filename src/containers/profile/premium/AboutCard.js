// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import {
  Card,
  CardSegment,
  CardHeader,
  Label
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import {
  faEye,
  faRulerVertical,
  faUser,
  faVenusMars,
  faWeightHanging,
} from '@fortawesome/pro-solid-svg-icons';
import { faUserHardHat } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AboutDetail from './AboutDetail';
import * as FQN from '../../../edm/DataModelFqns';
import { inchesToFeetString } from '../../../utils/DataUtils';

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

const Name = styled.div`
  text-transform: uppercase;
  font-weight: 600;
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
`;

type Props = {
  physicalAppearance :Map;
  selectedPerson :Map;
};

class AboutCard extends Component<Props> {

  formattedName = () => {
    const { selectedPerson } = this.props;
    const firstName = selectedPerson.getIn([FQN.PERSON_FIRST_NAME_FQN, 0], '');
    const lastName = selectedPerson.getIn([FQN.PERSON_LAST_NAME_FQN, 0], '');
    const middle = selectedPerson.getIn([FQN.PERSON_MIDDLE_NAME_FQN, 0], '');
    let middleInitial = '';

    if (middle) {
      middleInitial = `${middle.charAt(0)}.`;
    }

    return `${lastName}, ${firstName} ${middleInitial}`;
  }

  render() {

    const {
      physicalAppearance,
      selectedPerson
    } = this.props;

    const formattedName = this.formattedName();

    const rawDob = selectedPerson.getIn([FQN.PERSON_DOB_FQN, 0], '');
    const race = selectedPerson.getIn([FQN.PERSON_RACE_FQN, 0], '---');
    const sex = selectedPerson.getIn([FQN.PERSON_SEX_FQN, 0], '---');
    const aliases = selectedPerson.getIn([FQN.PERSON_NICK_NAME_FQN], '---');
    let formattedDob = '';

    if (rawDob) {
      formattedDob = DateTime.fromISO(rawDob).toLocaleString(DateTime.DATE_SHORT);
    }

    const hairColor = physicalAppearance.getIn([FQN.HAIR_COLOR_FQN, 0], '---');
    const eyeColor = physicalAppearance.getIn([FQN.EYE_COLOR_FQN, 0], '---');
    const height = physicalAppearance.getIn([FQN.HEIGHT_FQN, 0]);
    const weight = physicalAppearance.getIn([FQN.WEIGHT_FQN, 0]);

    const formattedHeight = height ? inchesToFeetString(height) : '---';
    const formattedWeight = weight ? `${weight} lbs` : '---';

    return (
      <Card>
        <CardHeader mode="primary" padding="sm">
          <H1>
            <IconWrapper>
              <FontAwesomeIcon icon={faUser} fixedWidth />
            </IconWrapper>
            About
          </H1>
        </CardHeader>
        <CardSegment vertical padding="sm">
          <Name>{formattedName}</Name>
          <div>{formattedDob}</div>
        </CardSegment>
        <CardSegment vertical padding="sm">
          <Label subtle>
            Aliases
          </Label>
          {aliases}
        </CardSegment>
        <CardSegment vertical padding="sm">
          <AboutDetail icon={faUser} content={race} />
          <AboutDetail icon={faVenusMars} content={sex} />
          <AboutGrid>
            <AboutDetail icon={faRulerVertical} content={formattedHeight} />
            <AboutDetail icon={faWeightHanging} content={formattedWeight} />
            <AboutDetail icon={faUserHardHat} content={hairColor} />
            <AboutDetail icon={faEye} content={eyeColor} />
          </AboutGrid>
        </CardSegment>
      </Card>
    );
  }
}

export default AboutCard;
