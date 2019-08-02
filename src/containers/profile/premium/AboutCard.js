// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import {
  Button,
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
  faEdit
} from '@fortawesome/pro-solid-svg-icons';
import { faUserHardHat } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AboutDetail from './AboutDetail';
import EditAboutModal from './EditAboutModal';
import * as FQN from '../../../edm/DataModelFqns';
import { inchesToFeetString } from '../../../utils/DataUtils';
import { getNameFromPerson } from '../../../utils/PersonUtils';

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

const EditButton = styled(Button)`
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

  > div:nth-child(-n + 2) {
    grid-column: auto / span 2;
  };
`;

type Props = {
  physicalAppearance :Map;
  selectedPerson :Map;
  isLoading :boolean;
};

type State = {
  showEdit :boolean;
};

class AboutCard extends Component<Props, State> {

  state = {
    showEdit: false
  };

  handleShowEdit = () => {
    this.setState({
      showEdit: true
    });
  }

  handleHideEdit = () => {
    this.setState({
      showEdit: false
    });
  }

  render() {

    const {
      isLoading,
      physicalAppearance,
      selectedPerson
    } = this.props;
    const { showEdit } = this.state;

    const formattedName = getNameFromPerson(selectedPerson);

    const rawDob = selectedPerson.getIn([FQN.PERSON_DOB_FQN, 0], '');
    const race = selectedPerson.getIn([FQN.PERSON_RACE_FQN, 0], '');
    const sex = selectedPerson.getIn([FQN.PERSON_SEX_FQN, 0], '');
    const aliases = selectedPerson.getIn([FQN.PERSON_NICK_NAME_FQN], '');
    let formattedDob = '';

    if (rawDob) {
      formattedDob = DateTime.fromISO(rawDob).toLocaleString(DateTime.DATE_SHORT);
    }

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
            <EditButton mode="primary" onClick={this.handleShowEdit}>
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
          </AboutGrid>
        </CardSegment>
        <EditAboutModal isVisible={showEdit} onClose={this.handleHideEdit} />
      </Card>
    );
  }
}

export default AboutCard;
