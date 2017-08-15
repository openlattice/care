/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import { Page, PageHeader, Title, Description, FormWrapper, SubmitButton, SubmitButtonWrapper } from '../shared/Layout';
import ReportInfoView from '../components/ReportInfoView';
import ConsumerInfoView from '../components/ConsumerInfoView';
import ComplainantInfoView from '../components/ComplainantInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';

function FormView({ handleInput, handleDateInput, handleTimeInput, handleSingleSelection, handleCheckboxChange, handleSubmit, input }) {
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
              handleDateInput={handleDateInput}
              handleTimeInput={handleTimeInput}
              handleSingleSelection={handleSingleSelection}
              input={input.reportInfo}
              section='reportInfo' />
          <ConsumerInfoView
              handleInput={handleInput}
              handleDateInput={handleDateInput}
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
          <SubmitButtonWrapper>
            <SubmitButton type='submit' bsStyle='primary' bsSize='lg'>Submit</SubmitButton>
          </SubmitButtonWrapper>
        </form>
      </FormWrapper>
    </Page>
	);
}

FormView.propTypes = {
  handleInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired
}

export default FormView;
