// @flow
import React, { useRef } from 'react';

import { Map } from 'immutable';
import {
  CardStack
} from 'lattice-ui-kit';
import { useLocation } from 'react-router';
import { Redirect } from 'react-router-dom';

import NewSymptomsReport from './NewSymptomsReport';

import ProfileBanner from '../../profile/ProfileBanner';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { HOME_PATH } from '../../../core/router/Routes';

const NewSymptomsReportContainer = () => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement | null>(null);

  const { state: selectedPerson = Map() } = location;
  // if (!Map.isMap(selectedPerson) || selectedPerson.isEmpty()) return <Redirect to={HOME_PATH} />;

  return (
    <ContentOuterWrapper ref={pageRef}>
      <ProfileBanner selectedPerson={selectedPerson} />
      <ContentWrapper>
        <CardStack>
          <NewSymptomsReport pageRef={pageRef} selectedPerson={selectedPerson} />
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default NewSymptomsReportContainer;
