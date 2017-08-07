/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import { Page, PageHeader, Title, Description, FormWrapper, SubmitButton, BtnWrapper } from '../shared/Layout';
import ReportInfoView from '../components/ReportInfoView';
import ConsumerInfoView from '../components/ConsumerInfoView';
import ComplainantInfoView from '../components/ComplainantInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';

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
