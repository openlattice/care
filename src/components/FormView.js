/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import Form from '../containers/Form';

const Page = styled.div`
  margin: 60px;
`;

const PageHeader = styled.div`
  margin-bottom: 60px;
`;

const Title = styled.h1`
  text-align: center;
  color: lightblue;
  font-size: 40px;
`;

const Description = styled.div`
  text-align: center;
  font-size: 24px;
`;

function FormView() {
	return (
    <Page>
      <PageHeader>
    		<Title>Behavioral Health Report</Title>
    		<Description>Baltimore Police Department</Description>
      </PageHeader>
      <form>
        <Form />
      </form>
    </Page>
	);
}

export default FormView;

// TODO: NEED TO RESTRUCTURE COMPONENTS TO DO ONSUBMIT?
