// @flow
import React from 'react';
// import { Switch, Route } from 'react-router-dom';
import {
  Card,
  CardSegment,
  CardStack,
  Stepper,
} from 'lattice-ui-kit';
import type { Match } from 'react-router-dom';

import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import NavStep from './NavStep';

type Props = {
  match :Match;
};

const EditProfileContainer = (props :Props) => {
  const { match } = props;

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <Card>
            <CardSegment padding="sm">
              <Stepper>
                <NavStep to={`${match.url}/basic-information`}>Basic Information</NavStep>
                <NavStep to={`${match.url}/officer-safety`}>Officer Safety</NavStep>
                <NavStep to={`${match.url}/response-plan`}>Background & Response Plan</NavStep>
                <NavStep to={`${match.url}/contacts`}>Contacts</NavStep>
                <NavStep to={`${match.url}/about`}>About</NavStep>
              </Stepper>
            </CardSegment>
          </Card>
          <Card>
            <CardSegment padding="sm" vertical>
              content
            </CardSegment>
          </Card>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default EditProfileContainer;
