/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import { Page, PageHeader, Title, Description, FormWrapper, SubmitButton, SubmitButtonWrapper } from '../shared/Layout';
import LogoutButton from '../containers/LogoutButton';
import SectionWrapper from '../containers/SectionWrapper';


function FormView({ handleTextInput, handleDateInput, handleTimeInput, handleSingleSelection, handleCheckboxChange, handleSubmit, page, maxPage, handlePageChange, input }) {
	return (
    <Page>
      <PageHeader>
    		<Title>Behavioral Health Report</Title>
        <LogoutButton />
      </PageHeader>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <SectionWrapper
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleTimeInput={handleTimeInput}
              handleSingleSelection={handleSingleSelection}
              handleCheckboxChange={handleCheckboxChange}
              input={input}
              page={page}
              maxPage={maxPage}
              handlePageChange={handlePageChange} />
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
