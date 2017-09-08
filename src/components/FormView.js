/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';
import { ProgressBar } from 'react-bootstrap';

import { Page, InnerPageWrapper, PageHeader, Title, Description, FormWrapper, SubmitButton, SubmitButtonWrapper } from '../shared/Layout';
import LogoutButton from '../containers/app/LogoutButton';
import SectionWrapperView from './SectionWrapperView';

const StyledProgressBar = styled(ProgressBar)`
  position: relative;
  top: 90px;
  left: 50%;
  width: 900px;
  margin-left: -450px;
`;


function FormView({ 
  handleTextInput,
  handleDateInput,
  handleTimeInput,
  handleSingleSelection,
  handleCheckboxChange,
  handlePersonSelection,
  personEntitySetId,
  handleSubmit,
  maxPage,
  handlePageChange,
  page,
  getPage,
  input
}) {

	const getProgress = () => {
    const num = Math.ceil((page - 1) / (maxPage - 1) * 100);
    const percentage = num.toString() + '%';
    return {
      num,
      percentage
    }
  }

  return (
    <Page>
      <PageHeader>
    		<Title>Behavioral Health Report</Title>
        <LogoutButton />
      </PageHeader>
      <StyledProgressBar now={getProgress().num} label={getProgress().percentage} />
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <SectionWrapperView
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleTimeInput={handleTimeInput}
              handleSingleSelection={handleSingleSelection}
              handleCheckboxChange={handleCheckboxChange}
              input={input}
              page={page}
              getPage={getPage}
              maxPage={maxPage}
              handlePageChange={handlePageChange}
              handlePersonSelection={handlePersonSelection}
              personEntitySetId={personEntitySetId} />
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
