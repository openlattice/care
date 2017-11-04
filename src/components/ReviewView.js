/*
 * @flow
 */

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
import { SectionHeader } from '../shared/Layout';

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
  handlePageChange
}) => {

  return (
    <div>
      <div>
        <SectionHeader>Review</SectionHeader>

        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Report Info</SectionTitle>
            <EditLink to="/1">edit</EditLink>
          </SectionHeaderWrapper>
          <ReportInfoView
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleTimeInput={handleTimeInput}
              handleSingleSelection={handleSingleSelection}
              input={reportInfo}
              section="reportInfo"
              isInReview={isInReview}
              handlePageChange={handlePageChange} />
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Consumer</SectionTitle>
            <EditLink to="/3">edit</EditLink>
          </SectionHeaderWrapper>
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
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Complainant</SectionTitle>
            <EditLink to="/4">edit</EditLink>
          </SectionHeaderWrapper>
          <ComplainantInfoView
              handleTextInput={handleTextInput}
              input={complainantInfo}
              isInReview={isInReview}
              handlePageChange={handlePageChange}
              section="complainantInfo" />
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Disposition</SectionTitle>
            <EditLink to="/5">edit</EditLink>
          </SectionHeaderWrapper>
          <DispositionView
              handleTextInput={handleTextInput}
              handleCheckboxChange={handleCheckboxChange}
              handleSingleSelection={handleSingleSelection}
              input={dispositionInfo}
              isInReview={isInReview}
              handlePageChange={handlePageChange}
              section="dispositionInfo" />
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Officer</SectionTitle>
            <EditLink to="/6">edit</EditLink>
          </SectionHeaderWrapper>
          <OfficerInfoView
              handleTextInput={handleTextInput}
              handleCheckboxChange={handleCheckboxChange}
              input={officerInfo}
              isInReview={isInReview}
              handlePageChange={handlePageChange}
              section="officerInfo" />
        </Section>

        <FormNav submit />
      </div>

    </div>
  );
};

ReviewView.propTypes = {
  reportInfo: PropTypes.object.isRequired,
  consumerInfo: PropTypes.object.isRequired,
  complainantInfo: PropTypes.object.isRequired,
  dispositionInfo: PropTypes.object.isRequired,
  officerInfo: PropTypes.object.isRequired,
  handleTextInput: PropTypes.func.isRequired,
  handleDateInput: PropTypes.func.isRequired,
  handleTimeInput: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  isInReview: PropTypes.func.isRequired,
  consumerIsSelected: PropTypes.bool.isRequired
};

export default ReviewView;
