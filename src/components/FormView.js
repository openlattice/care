/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import { SubmitButton, BtnWrapper } from '../shared/Layout';
import ReportInfoView from '../components/ReportInfoView';
import ConsumerInfoView from '../components/ConsumerInfoView';
import ComplainantInfoView from '../components/ComplainantInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';

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
  margin: 0 60px 0 60px;
  padding-bottom: 100px;
`;

function FormView({ handleInput, handleSingleSelection, handleCheckboxChange, handleSubmit, input }) {
	return (
    <Page>
      <PageHeader>
    		<Title>Behavioral Health Report</Title>
    		<Description>Baltimore Police Department</Description>
      </PageHeader>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <ReportInfoView
              handleInput={handleInput}
              handleSingleSelection={handleSingleSelection}
              input={input.reportInfo}
              section='reportInfo' />
          <ConsumerInfoView
              handleInput={handleInput}
              handleSingleSelection={handleSingleSelection}
              handleCheckboxChange={handleCheckboxChange}
              input={input.consumerInfo}
              section='consumerInfo' />
          <ComplainantInfoView
              handleInput={handleInput}
              input={input.complainantInfo}
              section='complainantInfo' />
          <DispositionView
              handleInput={handleInput}
              handleCheckboxChange={handleCheckboxChange}
              handleSingleSelection={handleSingleSelection}
              input={input.dispositionInfo}
              section='dispositionInfo' />
          <OfficerInfoView
              handleInput={handleInput}
              handleCheckboxChange={handleCheckboxChange}
              input={input.officerInfo}
              section='officerInfo' />
          <BtnWrapper>
            <SubmitButton type='submit' bsStyle='primary' bsSize='lg'>Submit</SubmitButton>
          </BtnWrapper>
        </form>
      </FormWrapper>
    </Page>
	);
}

export default FormView;
