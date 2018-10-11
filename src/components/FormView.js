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
import FormNav from './FormNav';
import { SUBMISSION_STATES } from '../containers/form/ReportReducer';
import { BHR_PATH, HOME_PATH, ROOT } from '../core/router/Routes';
import { FORM_PATHS } from '../shared/Consts';

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
  handlePageChange,
  handlePersonSelection,
  handlePicture,
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

  const getReportInfoView = () => {
    return (
      <>
        <ReportInfoView
            input={reportInfo}
            isInReview={false}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
        <FormNav
            prevPath={FORM_PATHS.CONSUMER}
            nextPath={FORM_PATHS.COMPLAINANT}
            handlePageChange={handlePageChange} />
      </>
    );
  };

  const getConsumerSearchView = () => {
    return (
      <ConsumerSearch
          handlePersonSelection={handlePersonSelection}
          personEntitySetId={personEntitySetId}
          selectedOrganizationId={selectedOrganizationId} />
    );
  };

  const getConsumerInfoView = () => {
    return (
      <>
        <ConsumerInfoView
            consumerIsSelected={consumerIsSelected}
            handlePicture={handlePicture}
            input={consumerInfo}
            isInReview={false}
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
        <FormNav
            prevPath={FORM_PATHS.CONSUMER_SEARCH}
            nextPath={FORM_PATHS.REPORT}
            handlePageChange={handlePageChange} />
      </>
    );
  };

  const getComplainantInfoView = () => {
    return (
      <>
        <ComplainantInfoView
            input={complainantInfo}
            isInReview={false}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
        <FormNav
            prevPath={FORM_PATHS.REPORT}
            nextPath={FORM_PATHS.DISPOSITION}
            handlePageChange={handlePageChange} />
      </>
    );
  };

  const getDispositionView = () => {
    return (
      <>
        <DispositionView
            input={dispositionInfo}
            isInReview={false}
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
        <FormNav
            prevPath={FORM_PATHS.COMPLAINANT}
            nextPath={FORM_PATHS.OFFICER}
            handlePageChange={handlePageChange} />
      </>
    );
  };

  const getOfficerInfoView = () => {
    return (
      <>
        <OfficerInfoView
            input={officerInfo}
            isInReview={false}
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
        <FormNav
            prevPath={FORM_PATHS.DISPOSITION}
            nextPath={FORM_PATHS.REVIEW}
            handlePageChange={handlePageChange} />
      </>
    );
  };

  const getReviewView = () => {
    return (
      <>
        <ReviewView
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
        <FormNav
            handlePageChange={handlePageChange}
            handleSubmit={handleSubmit}
            submit />
      </>
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
              <NavLink to={ROOT}>Home</NavLink>
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
              <NavLink to={HOME_PATH}>
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
            <Route path={`${BHR_PATH}/1`} render={getConsumerSearchView} />
            <Route path={`${BHR_PATH}/2`} render={getConsumerInfoView} />
            <Route path={`${BHR_PATH}/3`} render={getReportInfoView} />
            <Route path={`${BHR_PATH}/4`} render={getComplainantInfoView} />
            <Route path={`${BHR_PATH}/5`} render={getDispositionView} />
            <Route path={`${BHR_PATH}/6`} render={getOfficerInfoView} />
            <Route path={`${BHR_PATH}/7`} render={getReviewView} />
            <Redirect to={`${BHR_PATH}/1`} />
          </Switch>
        </StyledCard>
      </ContainerInnerWrapper>
    </ContainerOuterWrapper>
  );
}

export default FormView;
