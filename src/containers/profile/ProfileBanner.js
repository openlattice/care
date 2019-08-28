// @flow
import React from 'react';
import styled from 'styled-components';
import { Map } from 'immutable';
import { Banner } from 'lattice-ui-kit';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';

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
  const dob = getDobFromPerson(selectedPerson);
  const name = getLastFirstMiFromPerson(selectedPerson);

  return (
    <Banner mode="default" isOpen sticky>
      <Content hasContent={selectedPerson.isEmpty()}>
        <Name>{name}</Name>
        <Birthdate>{`DOB: ${dob}`}</Birthdate>
      </Content>
    </Banner>
  );
};

export default ProfileBanner;
