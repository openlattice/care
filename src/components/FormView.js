/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

import ReportInfoView from '../components/ReportInfoView';
import ConsumerInfoView from '../components/ConsumerInfoView';
import ComplaintInfoView from '../components/ComplaintInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';

import {
  Page,
  PageHeader,
  Title,
  FormWrapper,
  SubmitButton,
  SubmitButtonWrapper,
  Warning
} from '../shared/Layout';

function FormView({
  handleTextInput,
  handleDateInput,
  handleTimeInput,
  handleSingleSelection,
  handleCheckboxChange,
  handleSubmit,
  input
}) {
  return (
    <Page>
      <PageHeader>
        <Title>Behavioral Health Report Public Demo</Title>
        <Warning>
          <p>This is a public demo of the Behavioral Health Report form. All data submitted is publicly available.</p>
          <p>Please do not submit any sensitive information.</p>
        </Warning>
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
