// @flow
import React, { useRef } from 'react';

import { Map } from 'immutable';
import {
  CardStack
} from 'lattice-ui-kit';
import { useLocation } from 'react-router';
import { Redirect } from 'react-router-dom';

import NewFollowupReport from './NewFollowupReport';

import ProfileBanner from '../../profile/ProfileBanner';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { HOME_PATH } from '../../../core/router/Routes';

const NewFollowupReportContainer = () => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement | null>(null);

  const { state = {} } = location;
  const { selectedPerson = Map(), incident = Map() } = state;
  if (!Map.isMap(selectedPerson) || selectedPerson.isEmpty()) return <Redirect to={HOME_PATH} />;

  return (
    <ContentOuterWrapper ref={pageRef}>
      <ProfileBanner selectedPerson={selectedPerson} />
      <ContentWrapper>
        <CardStack>
          <NewFollowupReport
              incident={incident}
              pageRef={pageRef}
              selectedPerson={selectedPerson} />
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default NewFollowupReportContainer;
