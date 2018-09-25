import React from 'react';
import styled from 'styled-components';
import {
  NavLink,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import Spinner from './spinner/Spinner';
import ReportInfoView from './ReportInfoView';
import ConsumerSearch from '../containers/ConsumerSearch';
import ConsumerInfoView from './ConsumerInfoView';
import ComplainantInfoView from './ComplainantInfoView';
import DispositionView from './DispositionView';
import OfficerInfoView from './OfficerInfoView';
import ReviewView from './ReviewView';
import StyledCard from './cards/StyledCard';
import * as Routes from '../core/router/Routes';
import { SUBMISSION_STATES } from '../containers/form/ReportReducer';

const ContainerOuterWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const ContainerInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  margin-top: 50px;
  width: 900px;
`;

const Success = styled.div`
  text-align: center;
  p {
    font-size: 20px;
    margin-bottom: 20px;
  }
  a {
    text-decoration: none;
  }
`;

const Failure = styled.div`
  text-align: center;
  a {
    text-decoration: none;
  }
`;

function FormView({
  complainantInfo,
  consumerInfo,
  consumerIsSelected,
  dispositionInfo,
  handleCheckboxChange,
  handlePageChange,
  handlePersonSelection,
  handlePicture,
  handleScaleSelection,
  handleSingleSelection,
  handleSubmit,
  isInReview,
  officerInfo,
  personEntitySetId,
  reportInfo,
  selectedOrganizationId,
  submissionState,
  updateStateValue,
  updateStateValues,
}) {

  // const getProgress = () => {
  //   const page = getCurrentPage();
  //   const num = Math.ceil(((page - 1) / (MAX_PAGE - 1)) * 100);
  //   const percentage = `${num.toString()}%`;
  //   return num === 0 ? { num: 5, percentage } : { num, percentage };
  // };

  const getReportInfoView = () => {
    return (
      <ReportInfoView
          handlePageChange={handlePageChange}
          input={reportInfo}
          isInReview={false}
          updateStateValue={updateStateValue}
          updateStateValues={updateStateValues} />
    );
  };

  const getConsumerSearchView = () => {
    return (
      <ConsumerSearch
          handlePersonSelection={handlePersonSelection}
          personEntitySetId={personEntitySetId}
          handlePageChange={handlePageChange}
          selectedOrganizationId={selectedOrganizationId} />
    );
  };

  const getConsumerInfoView = () => {
    return (
      <ConsumerInfoView
          consumerIsSelected={consumerIsSelected}
          handleCheckboxChange={handleCheckboxChange}
          handlePageChange={handlePageChange}
          handlePicture={handlePicture}
          handleScaleSelection={handleScaleSelection}
          handleSingleSelection={handleSingleSelection}
          input={consumerInfo}
          isInReview={false}
          selectedOrganizationId={selectedOrganizationId}
          updateStateValue={updateStateValue}
          updateStateValues={updateStateValues} />
    );
  };

  const getComplainantInfoView = () => {
    return (
      <ComplainantInfoView
          handlePageChange={handlePageChange}
          input={complainantInfo}
          isInReview={false}
          updateStateValue={updateStateValue}
          updateStateValues={updateStateValues} />
    );
  };

  const getDispositionView = () => {
    return (
      <DispositionView
          handleCheckboxChange={handleCheckboxChange}
          handlePageChange={handlePageChange}
          input={dispositionInfo}
          isInReview={false}
          selectedOrganizationId={selectedOrganizationId}
          updateStateValue={updateStateValue}
          updateStateValues={updateStateValues} />
    );
  };

  const getOfficerInfoView = () => {
    return (
      <OfficerInfoView
          handleCheckboxChange={handleCheckboxChange}
          handlePageChange={handlePageChange}
          input={officerInfo}
          isInReview={false}
          selectedOrganizationId={selectedOrganizationId}
          updateStateValue={updateStateValue}
          updateStateValues={updateStateValues} />
    );
  };

  const getReviewView = () => {
    return (
      <ReviewView
          handleCheckboxChange={handleCheckboxChange}
          handlePageChange={handlePageChange}
          handleScaleSelection={handleScaleSelection}
          handleSingleSelection={handleSingleSelection}
          handleSubmit={handleSubmit}
          reportInfo={reportInfo}
          consumerInfo={consumerInfo}
          complainantInfo={complainantInfo}
          dispositionInfo={dispositionInfo}
          officerInfo={officerInfo}
          isInReview
          consumerIsSelected={consumerIsSelected}
          selectedOrganizationId={selectedOrganizationId}
          updateStateValue={updateStateValue}
          updateStateValues={updateStateValues} />
    );
  };

  if (submissionState === SUBMISSION_STATES.IS_SUBMITTING) {
    return <Spinner />;
  }

  if (submissionState === SUBMISSION_STATES.SUBMIT_SUCCESS) {
    return (
      <ContainerOuterWrapper>
        <ContainerInnerWrapper>
          <StyledCard>
            <Success>
              <p>Success!</p>
              <NavLink to={Routes.ROOT}>Home</NavLink>
            </Success>
          </StyledCard>
        </ContainerInnerWrapper>
      </ContainerOuterWrapper>
    );
  }

  if (submissionState === SUBMISSION_STATES.SUBMIT_FAILURE) {
    return (
      <ContainerOuterWrapper>
        <ContainerInnerWrapper>
          <StyledCard>
            <Failure>
              <NavLink to={`${Routes.BHR_PATH}/1`}>
                Failed to submit. Please try again. If there continues to be an issue, contact help@openlattice.com.
              </NavLink>
            </Failure>
          </StyledCard>
        </ContainerInnerWrapper>
      </ContainerOuterWrapper>
    );
  }

  return (
    <ContainerOuterWrapper>
      <ContainerInnerWrapper>
        <StyledCard>
          <Switch>
            <Route path={`${Routes.BHR_PATH}/1`} render={getConsumerSearchView} />
            <Route path={`${Routes.BHR_PATH}/2`} render={getConsumerInfoView} />
            <Route path={`${Routes.BHR_PATH}/3`} render={getReportInfoView} />
            <Route path={`${Routes.BHR_PATH}/4`} render={getComplainantInfoView} />
            <Route path={`${Routes.BHR_PATH}/5`} render={getDispositionView} />
            <Route path={`${Routes.BHR_PATH}/6`} render={getOfficerInfoView} />
            <Route path={`${Routes.BHR_PATH}/7`} render={getReviewView} />
            <Redirect to={`${Routes.BHR_PATH}/1`} />
          </Switch>
        </StyledCard>
      </ContainerInnerWrapper>
    </ContainerOuterWrapper>
  );
}

export default FormView;
