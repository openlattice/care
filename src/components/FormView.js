/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ProgressBar } from 'react-bootstrap';
import { Redirect, Route, Switch } from 'react-router-dom';

import {
  Page,
  PageHeader,
  Title,
  FormWrapper
} from '../shared/Layout';
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
    console.log('page:', page);

    const num = Math.ceil(((page - 1) / (maxPage - 1)) * 100);
    const percentage = `${num.toString()}%`;
    console.log('num:', num);
    return num === 0 ? { num: 5, percentage } : { num, percentage };
  };

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
          section="reportInfo" />
    );
  };

  const getConsumerSearchView = () => {
    return (
      <ConsumerSearch
          handlePersonSelection={handlePersonSelection}
          handlePageChange={handlePageChange}
          personEntitySetId={personEntitySetId}
          handlePageChange={handlePageChange} />
    );
  };

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
          section="consumerInfo" />
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
          section="complainantInfo" />
    );
  };

  const getDispositionView = () => {
    return (
      <DispositionView
          handleTextInput={handleTextInput}
          handleCheckboxChange={handleCheckboxChange}
          handleSingleSelection={handleSingleSelection}
          input={dispositionInfo}
          isInReview={isInReview}
          handlePageChange={handlePageChange}
          section="dispositionInfo" />
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
          section="officerInfo" />
    );
  };

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
          consumerIsSelected={consumerIsSelected}
          handlePageChange={handlePageChange} />
    );
  };

  return (
    <Page>
      <PageHeader>
        <Title>Behavioral Health Report</Title>
        <LogoutButton />
      </PageHeader>
      <StyledProgressBar bsStyle="info" now={getProgress().num} label={getProgress().percentage} />
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
  handleDateInput: PropTypes.func.isRequired,
  handleTimeInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  maxPage: PropTypes.number.isRequired,
  isInReview: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePersonSelection: PropTypes.func.isRequired,
  personEntitySetId: PropTypes.string.isRequired,
  consumerIsSelected: PropTypes.bool.isRequired,
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
