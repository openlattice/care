import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ReportInfoView from './ReportInfoView';
import ConsumerInfoView from './ConsumerInfoView';
import ComplainantInfoView from './ComplainantInfoView';
import DispositionView from './DispositionView';
import OfficerInfoView from './OfficerInfoView';
import FormNav from './FormNav';
import { SectionWrapper, ContentWrapper, SectionHeader } from '../shared/Layout';
import { FORM_PATHS } from '../shared/Consts';

const SectionHeaderWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SectionTitle = styled.span`
  font-size: 28px;
  margin-right: 10px;
`;

const EditLink = styled(Link)`
  position: absolute;
  top: 12px;
  font-size: 16px;
`;

const Section = styled.div`
  margin-bottom: 60px;
`;


const ReviewView = ({
  reportInfo,
  consumerInfo,
  complainantInfo,
  dispositionInfo,
  officerInfo,
  handleTextInput,
  handleDateInput,
  handleTimeInput,
  handleCheckboxChange,
  handleSingleSelection,
  isInReview,
  consumerIsSelected,
  handleMultiUpdate,
  handlePageChange,
  handleScaleSelection,
  selectedOrganizationId
}) => {

  return (
    <SectionWrapper>
      <SectionHeader>Review</SectionHeader>

      <ContentWrapper>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Report Info</SectionTitle>
            <EditLink to={FORM_PATHS.REPORT}>edit</EditLink>
          </SectionHeaderWrapper>
          <ReportInfoView
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleTimeInput={handleTimeInput}
              handleSingleSelection={handleSingleSelection}
              input={reportInfo}
              section="reportInfo"
              isInReview={isInReview}
              handlePageChange={handlePageChange}
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Consumer</SectionTitle>
            <EditLink to={FORM_PATHS.CONSUMER}>edit</EditLink>
          </SectionHeaderWrapper>
          <ConsumerInfoView
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleScaleSelection={handleScaleSelection}
              handleSingleSelection={handleSingleSelection}
              handleCheckboxChange={handleCheckboxChange}
              input={consumerInfo}
              consumerIsSelected={consumerIsSelected}
              isInReview={isInReview}
              handlePageChange={handlePageChange}
              section="consumerInfo"
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Complainant</SectionTitle>
            <EditLink to={FORM_PATHS.COMPLAINANT}>edit</EditLink>
          </SectionHeaderWrapper>
          <ComplainantInfoView
              handleTextInput={handleTextInput}
              input={complainantInfo}
              isInReview={isInReview}
              handlePageChange={handlePageChange}
              section="complainantInfo"
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Disposition</SectionTitle>
            <EditLink to={FORM_PATHS.DISPOSITION}>edit</EditLink>
          </SectionHeaderWrapper>
          <DispositionView
              handleCheckboxChange={handleCheckboxChange}
              handleMultiUpdate={handleMultiUpdate}
              handlePageChange={handlePageChange}
              handleScaleSelection={handleScaleSelection}
              handleSingleSelection={handleSingleSelection}
              handleTextInput={handleTextInput}
              input={dispositionInfo}
              isInReview={isInReview}
              section="dispositionInfo"
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Officer</SectionTitle>
            <EditLink to={FORM_PATHS.OFFICER}>edit</EditLink>
          </SectionHeaderWrapper>
          <OfficerInfoView
              handleTextInput={handleTextInput}
              handleCheckboxChange={handleCheckboxChange}
              input={officerInfo}
              isInReview={isInReview}
              handlePageChange={handlePageChange}
              section="officerInfo"
              selectedOrganizationId={selectedOrganizationId} />
        </Section>
      </ContentWrapper>

      <FormNav submit handlePageChange={handlePageChange} />

    </SectionWrapper>
  );
};

ReviewView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  handleDateInput: PropTypes.func.isRequired,
  handleTimeInput: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleMultiUpdate: PropTypes.func.isRequired,
  handleScaleSelection: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  isInReview: PropTypes.func.isRequired,
  consumerIsSelected: PropTypes.bool.isRequired,
  handlePageChange: PropTypes.func.isRequired,
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
  }).isRequired,
  selectedOrganizationId: PropTypes.string.isRequired
};

export default ReviewView;
