import React from 'react';
import PropTypes from 'prop-types';
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
import { MAX_PAGE } from '../shared/Consts';
import { getCurrentPage } from '../utils/Utils';

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
  handleDateInput,
  handleDatePickerDateTimeOffset,
  handleMultiUpdate,
  handlePageChange,
  handlePersonSelection,
  handlePicture,
  handleScaleSelection,
  handleSingleSelection,
  handleSubmit,
  handleTextInput,
  handleTimeInput,
  isInReview,
  officerInfo,
  personEntitySetId,
  reportInfo,
  selectedOrganizationId,
  submissionState
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
          handleDatePickerDateTimeOffset={handleDatePickerDateTimeOffset}
          handlePageChange={handlePageChange}
          handleTextInput={handleTextInput}
          handleTimeInput={handleTimeInput}
          handleSingleSelection={handleSingleSelection}
          input={reportInfo}
          isInReview={isInReview}
          section="reportInfo"
          selectedOrganizationId={selectedOrganizationId} />
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
          handleDateInput={handleDateInput}
          handleMultiUpdate={handleMultiUpdate}
          handlePageChange={handlePageChange}
          handlePicture={handlePicture}
          handleScaleSelection={handleScaleSelection}
          handleSingleSelection={handleSingleSelection}
          handleTextInput={handleTextInput}
          input={consumerInfo}
          isInReview={isInReview}
          section="consumerInfo"
          selectedOrganizationId={selectedOrganizationId} />
    );
  };

  const getComplainantInfoView = () => {
    return (
      <ComplainantInfoView
          handleTextInput={handleTextInput}
          input={complainantInfo}
          isInReview={isInReview}
          handlePageChange={handlePageChange}
          handleSingleSelection={handleSingleSelection}
          section="complainantInfo"
          selectedOrganizationId={selectedOrganizationId} />
    );
  };

  const getDispositionView = () => {
    return (
      <DispositionView
          handleCheckboxChange={handleCheckboxChange}
          handleMultiUpdate={handleMultiUpdate}
          handleScaleSelection={handleScaleSelection}
          handleSingleSelection={handleSingleSelection}
          handleTextInput={handleTextInput}
          input={dispositionInfo}
          isInReview={isInReview}
          handlePageChange={handlePageChange}
          section="dispositionInfo"
          selectedOrganizationId={selectedOrganizationId} />
    );
  };

  const getOfficerInfoView = () => {
    return (
      <OfficerInfoView
          handleTextInput={handleTextInput}
          handleCheckboxChange={handleCheckboxChange}
          input={officerInfo}
          isInReview={isInReview}
          handlePageChange={handlePageChange}
          section="officerInfo"
          selectedOrganizationId={selectedOrganizationId} />
    );
  };

  const getReviewView = () => {
    return (
      <ReviewView
          handleCheckboxChange={handleCheckboxChange}
          handleDateInput={handleDateInput}
          handleDatePickerDateTimeOffset={handleDatePickerDateTimeOffset}
          handleMultiUpdate={handleMultiUpdate}
          handlePageChange={handlePageChange}
          handleScaleSelection={handleScaleSelection}
          handleSingleSelection={handleSingleSelection}
          handleTextInput={handleTextInput}
          handleTimeInput={handleTimeInput}
          reportInfo={reportInfo}
          consumerInfo={consumerInfo}
          complainantInfo={complainantInfo}
          dispositionInfo={dispositionInfo}
          officerInfo={officerInfo}
          isInReview={isInReview}
          consumerIsSelected={consumerIsSelected}
          selectedOrganizationId={selectedOrganizationId} />
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
              <NavLink to={`${Routes.BHR}/1`}>
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
            <Route path={`${Routes.BHR}/1`} render={getConsumerSearchView} />
            <Route path={`${Routes.BHR}/2`} render={getConsumerInfoView} />
            <Route path={`${Routes.BHR}/3`} render={getReportInfoView} />
            <Route path={`${Routes.BHR}/4`} render={getComplainantInfoView} />
            <Route path={`${Routes.BHR}/5`} render={getDispositionView} />
            <Route path={`${Routes.BHR}/6`} render={getOfficerInfoView} />
            <Route path={`${Routes.BHR}/7`} render={getReviewView} />
            <Redirect to={`${Routes.BHR}/1`} />
          </Switch>
        </StyledCard>
      </ContainerInnerWrapper>
    </ContainerOuterWrapper>
  );
}

FormView.propTypes = {
  handleDatePickerDateTimeOffset: PropTypes.func.isRequired,
  handleMultiUpdate: PropTypes.func.isRequired,
  handlePicture: PropTypes.func.isRequired,
  handleTextInput: PropTypes.func.isRequired,
  handleDateInput: PropTypes.func.isRequired,
  handleTimeInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleScaleSelection: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isInReview: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePersonSelection: PropTypes.func.isRequired,
  personEntitySetId: PropTypes.string.isRequired,
  consumerIsSelected: PropTypes.bool.isRequired,
  selectedOrganizationId: PropTypes.string.isRequired,
  submissionState: PropTypes.number.isRequired,
  reportInfo: PropTypes.shape({
    dispatchReason: PropTypes.string.isRequired,
    complaintNumber: PropTypes.string.isRequired,
    companionOffenseReport: PropTypes.bool.isRequired,
    incident: PropTypes.string.isRequired,
    locationOfIncident: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    postOfOccurrence: PropTypes.string.isRequired,
    cadNumber: PropTypes.string.isRequired,
    onView: PropTypes.bool.isRequired,
    dateOccurred: PropTypes.string.isRequired,
    timeOccurred: PropTypes.string.isRequired,
    dateReported: PropTypes.string.isRequired,
    timeReported: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  consumerInfo: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    middleName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    identification: PropTypes.string.isRequired,
    militaryStatus: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    race: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    homeless: PropTypes.bool.isRequired,
    homelessLocation: PropTypes.string.isRequired,
    drugsAlcohol: PropTypes.string.isRequired,
    drugType: PropTypes.string.isRequired,
    prescribedMedication: PropTypes.string.isRequired,
    takingMedication: PropTypes.string.isRequired,
    prevPsychAdmission: PropTypes.string.isRequired,
    selfDiagnosis: PropTypes.array.isRequired,
    selfDiagnosisOther: PropTypes.string.isRequired,
    armedWithWeapon: PropTypes.bool.isRequired,
    armedWeaponType: PropTypes.string.isRequired,
    accessToWeapons: PropTypes.bool.isRequired,
    accessibleWeaponType: PropTypes.string.isRequired,
    observedBehaviors: PropTypes.array.isRequired,
    observedBehaviorsOther: PropTypes.string.isRequired,
    emotionalState: PropTypes.array.isRequired,
    emotionalStateOther: PropTypes.string.isRequired,
    photosTakenOf: PropTypes.array.isRequired,
    injuries: PropTypes.array.isRequired,
    injuriesOther: PropTypes.string.isRequired,
    suicidal: PropTypes.bool.isRequired,
    suicidalActions: PropTypes.array.isRequired,
    suicideAttemptMethod: PropTypes.array.isRequired,
    suicideAttemptMethodOther: PropTypes.string.isRequired
  }).isRequired,
  complainantInfo: PropTypes.shape({
    complainantName: PropTypes.string.isRequired,
    complainantAddress: PropTypes.string.isRequired,
    complainantConsumerRelationship: PropTypes.string.isRequired,
    complainantPhone: PropTypes.string.isRequired
  }).isRequired,
  dispositionInfo: PropTypes.shape({
    disposition: PropTypes.array.isRequired,
    hospitalTransport: PropTypes.bool.isRequired,
    hospital: PropTypes.string.isRequired,
    deescalationTechniques: PropTypes.array.isRequired,
    deescalationTechniquesOther: PropTypes.string.isRequired,
    specializedResourcesCalled: PropTypes.array.isRequired,
    incidentNarrative: PropTypes.string.isRequired
  }).isRequired,
  officerInfo: PropTypes.shape({
    officerName: PropTypes.string.isRequired,
    officerSeqID: PropTypes.string.isRequired,
    officerInjuries: PropTypes.string.isRequired,
    officerCertification: PropTypes.array.isRequired
  }).isRequired
};

export default FormView;
