// @flow
import React, { useState } from 'react';

import { Form } from 'lattice-fabricate';
import {
  Card,
  CardSegment,
  CardStack,
  Stepper,
} from 'lattice-ui-kit';
import { useRouteMatch } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { schema, uiSchema } from './schemas/ProfileSchemas';

import Disposition from '../../pages/disposition/Disposition';
import NatureOfCrisis from '../../pages/natureofcrisis/NatureOfCrisis';
import NavStep from '../../profile/edit/NavStep';
import ObservedBehaviors from '../../pages/observedbehaviors/ObservedBehaviors';
import OfficerSafety from '../../pages/officersafety/OfficerSafety';
import ReviewContainer from '../ReviewContainer';
import SubjectInformation from '../../pages/subjectinformation/SubjectInformation';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';

type Props = {

};

const NewCrisisReportContainer = (props :Props) => {
  const match = useRouteMatch();

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <Stepper>
            <NavStep to={`${match.url}/1`} />
            <NavStep to={`${match.url}/2`} />
            <NavStep to={`${match.url}/3`} />
            <NavStep to={`${match.url}/4`} />
            <NavStep to={`${match.url}/5`} />
            <NavStep to={`${match.url}/6`} />
          </Stepper>
          <Card>
            <Form schema={schema} uiSchema={uiSchema} />
          </Card>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );

};

export default NewCrisisReportContainer;
