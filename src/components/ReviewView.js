/*
 * @flow
 */

import React from 'react';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ReportInfoView from './ReportInfoView';
import { PaddedRow, Label, InlineCheckbox, InlineRadio, TitleLabel, OtherWrapper } from '../shared/Layout';

const Header = styled.div`
  font-size: 32px;
  margin-bottom: 40px;
  color: #37454A;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

const SectionHeaderWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SectionTitle = styled.span`
  font-size: 28px;
`;

const EditLink = styled(Link)`
  position: absolute;
  right: 20px;
  font-size: 16px;
`;

const ReviewView = ({ input, handleTextInput, handleDateInput, handleTimeInput, handleSingleSelection, isInReview }) => {

  return (
    <div>
      <div>
        <Header>Review</Header>
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
      </div>

    </div>
  );
};

export default ReviewView;
