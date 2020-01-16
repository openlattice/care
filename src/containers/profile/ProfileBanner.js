// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Banner, StyleUtils } from 'lattice-ui-kit';

import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';

const { media } = StyleUtils;

const Content = styled.div`
  display: flex;
  flex: 1;
  font-size: 24px;
  min-width: 0;
  justify-content: center;
  transition: opacity 0.5s;
  opacity: ${(props) => (props.hasContent ? 0 : 1)};
  ${media.phone`
    font-size: 16px;
  `}
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
  noDob :boolean;
}

const ProfileBanner = ({ selectedPerson, noDob = false } :Props) => {
  const dob = getDobFromPerson(selectedPerson);
  const name = getLastFirstMiFromPerson(selectedPerson, true);

  return (
    <Banner mode="default" isOpen sticky>
      <Content hasContent={selectedPerson.isEmpty()}>
        <Name>{name}</Name>
        { !noDob && <Birthdate>{`DOB: ${dob}`}</Birthdate> }
      </Content>
    </Banner>
  );
};

export default ProfileBanner;
