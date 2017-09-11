/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';
import { ProgressBar, Button } from 'react-bootstrap';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Page, InnerPageWrapper, PageHeader, Title, Description, FormWrapper, SubmitButton, SubmitButtonWrapper } from '../shared/Layout';
import LogoutButton from '../containers/app/LogoutButton';
import ReportInfoView from '../components/ReportInfoView';
import ConsumerSearch from '../containers/ConsumerSearch';
import ConsumerInfoView from '../components/ConsumerInfoView';
import ComplainantInfoView from '../components/ComplainantInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';
import ReviewView from '../components/ReviewView';


const StyledProgressBar = styled(ProgressBar)`
  position: relative;
  top: 90px;
  left: 50%;
  width: 900px;
  margin-left: -450px;
`;


function FormView({
  maxPage,
  handleSubmit,
  handleTextInput,
  handleDateInput,
  handleTimeInput,
  handleSingleSelection,
  handleCheckboxChange,
  reportInfo,
  consumerInfo,
  complainantInfo,
  dispositionInfo,
  officerInfo,
  isInReview,
  handlePageChange,
  handlePersonSelection,
  personEntitySetId,
  consumerIsSelected
}) {

	const getProgress = () => {
    const page = window.location.hash.substr(2);
    const num = Math.ceil((page - 1) / (maxPage - 1) * 100);
    const percentage = num.toString() + '%';
    return {
      num,
      percentage
    }
  }

  const getReportInfoView = () => {
    return (
      <ReportInfoView
          handleTextInput={handleTextInput}
          handleDateInput={handleDateInput}
          handleTimeInput={handleTimeInput}
          handleSingleSelection={handleSingleSelection}
          input={reportInfo}
          isInReview={isInReview}
          maxPage={maxPage}
          handlePageChange={handlePageChange}
          section='reportInfo' />
    );
  }

  const getConsumerSearchView = () => {
    return (
      <ConsumerSearch
          handlePersonSelection={handlePersonSelection}
          handlePageChange={handlePageChange}
          personEntitySetId={personEntitySetId}
          handlePageChange={handlePageChange}
          isInReview={isInReview} />
    );
  }

  const getConsumerInfoView = () => {
    return (
      <ConsumerInfoView
          handleTextInput={handleTextInput}
          handleDateInput={handleDateInput}
          handleSingleSelection={handleSingleSelection}
          handleCheckboxChange={handleCheckboxChange}
          input={consumerInfo}
          consumerIsSelected={consumerIsSelected}
          isInReview={isInReview}
          handlePageChange={handlePageChange}
          section='consumerInfo' />
    );
  }

  const getComplainantInfoView = () => {
    return (
      <ComplainantInfoView
          handleTextInput={handleTextInput}
          input={complainantInfo}
          isInReview={isInReview}
          handlePageChange={handlePageChange}
          section='complainantInfo' />
    );
  }

  const getDispositionView = () => {
    return (
      <DispositionView
          handleTextInput={handleTextInput}
          handleCheckboxChange={handleCheckboxChange}
          handleSingleSelection={handleSingleSelection}
          input={dispositionInfo}
          isInReview={isInReview}
          handlePageChange={handlePageChange}
          section='dispositionInfo' />
    );
  }

  const getOfficerInfoView = () => {
    return (
      <OfficerInfoView
          handleTextInput={handleTextInput}
          handleCheckboxChange={handleCheckboxChange}
          input={officerInfo}
          isInReview={isInReview}
          handlePageChange={handlePageChange}
          section='officerInfo' />
    );
  }

  const getReviewView = () => {
    return (
      <ReviewView
          handleTextInput={handleTextInput}
          handleDateInput={handleDateInput}
          handleTimeInput={handleTimeInput}
          handleCheckboxChange={handleCheckboxChange}
          handleSingleSelection={handleSingleSelection}
          reportInfo={reportInfo}
          consumerInfo={consumerInfo}
          complainantInfo={complainantInfo}
          dispositionInfo={dispositionInfo}
          officerInfo={officerInfo}
          isInReview={isInReview}
          consumerIsSelected={consumerIsSelected} />
    );
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
          <Switch>
            <Route path="/1" render={getReportInfoView} />
            <Route path="/2" render={getConsumerSearchView} />
            <Route path="/3" render={getConsumerInfoView} />
            <Route path="/4" render={getComplainantInfoView} />
            <Route path="/5" render={getDispositionView} />
            <Route path="/6" render={getOfficerInfoView} />
            <Route path="/7" render={getReviewView} />
            <Redirect to="/1" />
          </Switch>
        </form>
      </FormWrapper>
    </Page>
	);
}

FormView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default FormView;
