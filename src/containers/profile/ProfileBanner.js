// @flow
import React from 'react';
import styled from 'styled-components';
import { Map } from 'immutable';
import { Banner } from 'lattice-ui-kit';
import * as FQN from '../../edm/DataModelFqns';

const Content = styled.div`
  display: flex;
  flex: 1;
  font-size: 24px;
  min-width: 0;
  justify-content: space-evenly;
`;

const Name = styled.strong`
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Birthdate = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type Props = {
  selectedPerson :Map;
}

const ProfileBanner = ({ selectedPerson } :Props) => {
  const firstName = selectedPerson.get(FQN.PERSON_FIRST_NAME_FQN, '');
  const lastName = selectedPerson.get(FQN.PERSON_LAST_NAME_FQN, '');
  const dob = selectedPerson.get(FQN.PERSON_DOB_FQN, '');
  const middle = selectedPerson.get(FQN.PERSON_MIDDLE_NAME_FQN, '');
  let middleInitial = '';

  if (middle) {
    middleInitial = `${middle.charAt(0)}.`;
  }

  return (
    <Banner isOpen>
      <Content>
        <Name>{`${lastName}, ${firstName} ${middleInitial}`}</Name>
        <Birthdate>{`DOB: ${dob}`}</Birthdate>
      </Content>
    </Banner>
  );
};

export default ProfileBanner;
