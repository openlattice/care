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
import ComplaintInfoView from '../components/ComplaintInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';

function FormView({ handleTextInput, handleDateInput, handleTimeInput, handleSingleSelection, handleCheckboxChange, handleSubmit, input }) {
	return (
    <Page>
      <PageHeader>
    		<Title>Behavioral Health Report</Title>
    		<Description>Baltimore Police Department</Description>
      </PageHeader>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <ReportInfoView
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleTimeInput={handleTimeInput}
              handleSingleSelection={handleSingleSelection}
              input={input.reportInfo}
              section='reportInfo' />
          <ConsumerInfoView
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleSingleSelection={handleSingleSelection}
              handleCheckboxChange={handleCheckboxChange}
              input={input.consumerInfo}
              section='consumerInfo' />
          <ComplaintInfoView
              handleTextInput={handleTextInput}
              input={input.complainantInfo}
              section='complainantInfo' />
          <DispositionView
              handleTextInput={handleTextInput}
              handleCheckboxChange={handleCheckboxChange}
              handleSingleSelection={handleSingleSelection}
              input={input.dispositionInfo}
              section='dispositionInfo' />
          <OfficerInfoView
              handleTextInput={handleTextInput}
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
  handleTextInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired
}

export default FormView;
