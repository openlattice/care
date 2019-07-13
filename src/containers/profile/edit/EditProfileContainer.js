// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  Card,
  CardSegment,
  CardStack,
  Stepper,
} from 'lattice-ui-kit';
import type { Match } from 'react-router-dom';


import NavStep from './NavStep';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import {
  BASIC_PATH,
  OFFICER_SAFETY_PATH,
  RESPONSE_PLAN_PATH,
  CONTACTS_PATH,
  ABOUT_PATH,
} from '../../../core/router/Routes';

type Props = {
  match :Match;
};

const EditProfileContainer = (props :Props) => {
  const { match } = props;
  console.log(match);

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <Card>
            <CardSegment padding="sm">
              <Stepper>
                <NavStep to={`${match.url}${BASIC_PATH}`}>Basic Information</NavStep>
                <NavStep to={`${match.url}${OFFICER_SAFETY_PATH}`}>Officer Safety</NavStep>
                <NavStep to={`${match.url}${RESPONSE_PLAN_PATH}`}>Background & Response Plan</NavStep>
                <NavStep to={`${match.url}${CONTACTS_PATH}`}>Contacts</NavStep>
                <NavStep to={`${match.url}${ABOUT_PATH}`}>About</NavStep>
              </Stepper>
            </CardSegment>
          </Card>
          <Switch>
            {/* <Route path={`${match.path}${BASIC_PATH}`} /> */}
            {/* <Route path={`${match.path}${OFFICER_SAFETY_PATH}`} /> */}
            {/* <Route path={`${match.path}${RESPONSE_PLAN_PATH}`} /> */}
            {/* <Route path={`${match.path}${CONTACTS_PATH}`} /> */}
            {/* <Route path={`${match.path}${ABOUT_PATH}`} /> */}
          </Switch>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default EditProfileContainer;
