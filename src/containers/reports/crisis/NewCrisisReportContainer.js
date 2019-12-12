// @flow
import React, { useRef } from 'react';

import { Form } from 'lattice-fabricate';
import {
  Card,
  CardStack,
  Stepper,
} from 'lattice-ui-kit';
import { useRouteMatch } from 'react-router';

import { schema, uiSchema } from './schemas/ProfileSchemas';

import NavStep from '../../profile/edit/NavStep';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';

type Props = {

};

const NewCrisisReportContainer = (props :Props) => {
  const formRef = useRef();
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
            <Form ref={formRef} schema={schema} uiSchema={uiSchema} />
          </Card>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );

};

export default NewCrisisReportContainer;
