// @flow
import React from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Map } from 'immutable';
import { Banner } from 'lattice-ui-kit';
import * as FQN from '../../edm/DataModelFqns';

const Content = styled.div`
  display: flex;
  flex: 1;
  font-size: 24px;
  min-width: 0;
  justify-content: center;
  transition: opacity 0.5s;
  opacity: ${props => (props.hasContent ? 0 : 1)};
`;

const Name = styled.strong`
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Birthdate = styled.span`
  margin-left: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type Props = {
  selectedPerson :Map;
}

const ProfileBanner = ({ selectedPerson } :Props) => {
  const firstName = selectedPerson.getIn([FQN.PERSON_FIRST_NAME_FQN, 0], '');
  const lastName = selectedPerson.getIn([FQN.PERSON_LAST_NAME_FQN, 0], '');
  const rawDob = selectedPerson.getIn([FQN.PERSON_DOB_FQN, 0], '');
  const middle = selectedPerson.getIn([FQN.PERSON_MIDDLE_NAME_FQN, 0], '');
  let middleInitial = '';
  let formattedDob = '';
  if (middle) {
    middleInitial = `${middle.charAt(0)}.`;
  }

  if (rawDob) {
    formattedDob = DateTime.fromISO(rawDob).toLocaleString(DateTime.DATE_SHORT);
  }

  return (
    <Banner mode="default" isOpen sticky>
      <Content hasContent={selectedPerson.isEmpty()}>
        <Name>{`${lastName}, ${firstName} ${middleInitial}`}</Name>
        <Birthdate>{`DOB: ${formattedDob}`}</Birthdate>
      </Content>
    </Banner>
  );
};

export default ProfileBanner;
