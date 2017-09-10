/*
 * @flow
 */

import React from 'react';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ReportInfoView from './ReportInfoView';
import ConsumerInfoView from './ConsumerInfoView';
import ComplainantInfoView from './ComplainantInfoView';
import DispositionView from './DispositionView';
import OfficerInfoView from './OfficerInfoView';
import FormNav from './FormNav';
import { PaddedRow, Label, InlineCheckbox, InlineRadio, TitleLabel, OtherWrapper, SectionHeader } from '../shared/Layout';
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


const ReviewView = ({ input, handleTextInput, handleDateInput, handleTimeInput, handleCheckboxChange, handleSingleSelection, isInReview, consumerIsSelected }) => {

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
              input={input.reportInfo}
              section='reportInfo'
              isInReview={isInReview} />
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
              input={input.consumerInfo}
              consumerIsSelected={input.consumerIsSelected}
              isInReview={isInReview}
              section='consumerInfo' />
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Complainant</SectionTitle>
            <EditLink to="/4">edit</EditLink>
          </SectionHeaderWrapper>
          <ComplainantInfoView
              handleTextInput={handleTextInput}
              input={input.complainantInfo}
              isInReview={isInReview}
              section='complainantInfo' />
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
              input={input.dispositionInfo}
              isInReview={isInReview}
              section='dispositionInfo' />
        </Section>
        <Section>
          <SectionHeaderWrapper>
            <SectionTitle>Officer</SectionTitle>
            <EditLink to="/6">edit</EditLink>
          </SectionHeaderWrapper>
          <OfficerInfoView
              handleTextInput={handleTextInput}
              handleCheckboxChange={handleCheckboxChange}
              input={input.officerInfo}
              isInReview={isInReview}
              section='officerInfo' />
        </Section>

        <FormNav submit />
      </div>

    </div>
  );
};

export default ReviewView;
