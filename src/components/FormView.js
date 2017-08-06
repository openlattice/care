/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import Form from '../containers/Form';
import { SubmitButton } from '../shared/Layout';

const Page = styled.div`
  background: #F4F4F4;
`;

const PageHeader = styled.div`
  padding: 60px;
  background: white;
  border-bottom: 1px solid darkgray;
`;

const Title = styled.h1`
  text-align: center;
  color: #37454A;
  font-size: 40px;
`;

const Description = styled.div`
  text-align: center;
  font-size: 24px;
  color: #37454A;
`;

const FormWrapper = styled.div`
  margin: 0 60px 60px 60px;
`;

function FormView() {
	return (
    <Page>
      <PageHeader>
    		<Title>Behavioral Health Report</Title>
    		<Description>Baltimore Police Department</Description>
      </PageHeader>
      <FormWrapper>
        <form>
          <Form />
          <SubmitButton type='submit'>Submit</SubmitButton>
        </form>
      </FormWrapper>
    </Page>
	);
}

export default FormView;

// TODO: NEED TO RESTRUCTURE COMPONENTS TO DO ONSUBMIT?
