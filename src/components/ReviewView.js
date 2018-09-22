import React from 'react';

import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { Link } from 'react-router-dom';

import ReportInfoView from './ReportInfoView';
import ConsumerInfoView from './ConsumerInfoView';
import ComplainantInfoView from './ComplainantInfoView';
import DispositionView from './DispositionView';
import OfficerInfoView from './OfficerInfoView';
import FormNav from './FormNav';
import { FORM_PATHS } from '../shared/Consts';

const { NEUTRALS } = Colors;

const ReviewHeader = styled.h1`
  color: ${NEUTRALS[0]};
  font-size: 32px;
  font-weight: normal;
  margin: 0 0 30px 0;
  text-align: center;
`;

const SectionHeaderWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`;

const SectionHeader = styled.h2`
  color: ${NEUTRALS[0]};
  font-size: 20px;
  font-weight: normal;
  margin: 0;
  text-align: center;
`;

const EditLink = styled(Link)`
  margin-left: 20px;
`;

const Section = styled.div`
  margin-bottom: 60px;
`;

const ReviewView = ({
  complainantInfo,
  consumerInfo,
  consumerIsSelected,
  dispositionInfo,
  handleCheckboxChange,
  handlePageChange,
  handleScaleSelection,
  handleSingleSelection,
  handleSubmit,
  isInReview,
  officerInfo,
  reportInfo,
  selectedOrganizationId,
  updateStateValue,
  updateStateValues,
}) => {

  return (
    <>
      <ReviewHeader>Review</ReviewHeader>
      <Section>
        <SectionHeaderWrapper>
          <SectionHeader>Report</SectionHeader>
          <EditLink to={FORM_PATHS.REPORT}>edit</EditLink>
        </SectionHeaderWrapper>
        <ReportInfoView
            handlePageChange={handlePageChange}
            handleSingleSelection={handleSingleSelection}
            input={reportInfo}
            isInReview={isInReview}
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
      <Section>
        <SectionHeaderWrapper>
          <SectionHeader>Consumer</SectionHeader>
          <EditLink to={FORM_PATHS.CONSUMER}>edit</EditLink>
        </SectionHeaderWrapper>
        <ConsumerInfoView
            consumerIsSelected={consumerIsSelected}
            handleCheckboxChange={handleCheckboxChange}
            handlePageChange={handlePageChange}
            handleScaleSelection={handleScaleSelection}
            handleSingleSelection={handleSingleSelection}
            input={consumerInfo}
            isInReview={isInReview}
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
      <Section>
        <SectionHeaderWrapper>
          <SectionHeader>Complainant</SectionHeader>
          <EditLink to={FORM_PATHS.COMPLAINANT}>edit</EditLink>
        </SectionHeaderWrapper>
        <ComplainantInfoView
            input={complainantInfo}
            isInReview={isInReview}
            handlePageChange={handlePageChange}
            section="complainantInfo"
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
      <Section>
        <SectionHeaderWrapper>
          <SectionHeader>Disposition</SectionHeader>
          <EditLink to={FORM_PATHS.DISPOSITION}>edit</EditLink>
        </SectionHeaderWrapper>
        <DispositionView
            handleCheckboxChange={handleCheckboxChange}
            handlePageChange={handlePageChange}
            handleScaleSelection={handleScaleSelection}
            handleSingleSelection={handleSingleSelection}
            input={dispositionInfo}
            isInReview={isInReview}
            section="dispositionInfo"
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
      <Section>
        <SectionHeaderWrapper>
          <SectionHeader>Officer</SectionHeader>
          <EditLink to={FORM_PATHS.OFFICER}>edit</EditLink>
        </SectionHeaderWrapper>
        <OfficerInfoView
            handleCheckboxChange={handleCheckboxChange}
            input={officerInfo}
            isInReview={isInReview}
            handlePageChange={handlePageChange}
            section="officerInfo"
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
      <FormNav
          handlePageChange={handlePageChange}
          handleSubmit={handleSubmit}
          submit />
    </>
  );
};

export default ReviewView;
