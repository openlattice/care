/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { Button, ProgressBar } from 'react-bootstrap';
import { Redirect, Route, Switch } from 'react-router-dom';

import ReportInfoView from '../components/ReportInfoView';
import ConsumerSearch from '../containers/ConsumerSearch';
import ConsumerInfoView from '../components/ConsumerInfoView';
import ComplainantInfoView from '../components/ComplainantInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';
import ReviewView from '../components/ReviewView';
import TestView from '../components/TestView';
import { SubmitButton } from '../shared/Layout';
import * as RoutePaths from '../core/router/RoutePaths';


const Header = styled.div`
  font-size: 32px;
  margin-bottom: 40px;
  color: #37454A;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

const NavBtnWrapper = styled.div`
  position: absolute;
  width: 300px;
  left: 50%;
  margin-left: -150px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin: 0 10px;
`;

const SectionWrapperView = ({
  handleTextInput,
  handleDateInput,
  handleTimeInput,
  handleSingleSelection,
  handleCheckboxChange,
  handlePersonSelection,
  personEntitySetId,
  input,
  maxPage,
  handlePageChange,
  page,
  isInReview,
  ...props
}) => {

  const renderHeader = () => {
    const location = window.location.hash.substr(2);
    console.log('location:', location);
    switch(location) {
      case 1:
        return <Header>Report Information</Header>;
      case 2:
        return <Header>Select Consumer</Header>
      case 3:
        return <Header>Consumer Information</Header>;
      case 4:
        return <Header>Complainant Information</Header>;
      case 5:
        return <Header>Disposition Information</Header>;
      case 6:
        return <Header>Officer Information</Header>;
      default:
        return;
    }
  }

  const getReportInfoView = () => {
    return (
      <ReportInfoView
          handleTextInput={handleTextInput}
          handleDateInput={handleDateInput}
          handleTimeInput={handleTimeInput}
          handleSingleSelection={handleSingleSelection}
          input={input.reportInfo}
          isInReview={isInReview}
          section='reportInfo' />
    );
  }

  const getConsumerSearchView = () => {
    return (
      <ConsumerSearch
          handlePersonSelection={handlePersonSelection}
          handlePageChange={handlePageChange}
          personEntitySetId={personEntitySetId}
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
          input={input.consumerInfo}
          consumerIsSelected={input.consumerIsSelected}
          isInReview={isInReview}
          section='consumerInfo' />
    );
  }

  const getComplainantInfoView = () => {
    return (
      <ComplainantInfoView
          handleTextInput={handleTextInput}
          input={input.complainantInfo}
          isInReview={isInReview}
          section='complainantInfo' />
    );
  }

  const getDispositionView = () => {
    return (
      <DispositionView
          handleTextInput={handleTextInput}
          handleCheckboxChange={handleCheckboxChange}
          handleSingleSelection={handleSingleSelection}
          input={input.dispositionInfo}
          isInReview={isInReview}
          section='dispositionInfo' />
    );
  }

  const getOfficerInfoView = () => {
    return (
      <OfficerInfoView
          handleTextInput={handleTextInput}
          handleCheckboxChange={handleCheckboxChange}
          input={input.officerInfo}
          isInReview={isInReview}
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
          input={input}
          isInReview={isInReview}
          consumerIsSelected={input.consumerIsSelected} />
    );
  }

  return (
    <div>
      { renderHeader() }
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
      <NavBtnWrapper> 
        { page > 1 && page < maxPage ? <StyledButton onClick={() => handlePageChange('prev')}>Prev</StyledButton> : null }
        { page === maxPage ? <SubmitButton>Submit</SubmitButton> : <StyledButton onClick={() => handlePageChange('next')}>Next</StyledButton> }
      </NavBtnWrapper>
    </div>
  );
}

SectionWrapperView.propTypes = {
};

export default SectionWrapperView;
