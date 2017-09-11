/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';

import FormNav from './FormNav';
import { TitleLabel, InlineRadio, PaddedRow, SectionHeader } from '../shared/Layout';
import { FORM_PATHS } from '../shared/Consts';
import { getRequiredValidation, getNumberValidation, getDateValidation } from '../shared/Validation';

const ReportInfoView = ({
  section,
  handleTextInput,
  handleDateInput,
  handleTimeInput,
  handleSingleSelection,
  input,
  isInReview,
  handlePageChange
}) => {

  const page = window.location.hash.substr(2);

	return (
		<div>
      { !isInReview() ? <SectionHeader>Report Info</SectionHeader> : null}
      <PaddedRow>
        <Col lg={6}>
    		    <TitleLabel>1. Primary Reason for Dispatch</TitleLabel>
            <FormControl data-section={section} name='dispatchReason' value={input.dispatchReason} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
        <Col lg={6}>
          <FormGroup validationState={getNumberValidation(input.complaintNumber)}>
            <TitleLabel>2. Complaint Number</TitleLabel>
            <FormControl data-section={section} name='complaintNumber' value={input.complaintNumber} onChange={handleTextInput} disabled={isInReview()} />
          </FormGroup>
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>3. Companion Offense Report Prepared</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='companionOffenseReport'
              value={true}
              checked={input.companionOffenseReport === 'true'}
              onChange={handleSingleSelection}
              disabled={isInReview()} >Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name ='companionOffenseReport'
              value={false}
              checked={input.companionOffenseReport === 'false'}
              onChange={handleSingleSelection}
              disabled={isInReview()} >No</InlineRadio>
        </Col>
        <Col lg={6}>
          <TitleLabel>4. Crime / Incident</TitleLabel>
          <FormControl data-section={section} name='incident' value={input.incident} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>5. Location of Offense / Incident</TitleLabel>
          <FormControl data-section={section} name='locationOfIncident' value={input.locationOfIncident} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>6. Unit</TitleLabel>
          <FormControl data-section={section} name='unit' value={input.unit} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
        <Col lg={6}>
          <TitleLabel>7. Post of Occurrence</TitleLabel>
          <FormControl data-section={section} name='postOfOccurrence' value={input.postOfOccurrence} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={6}>
          <FormGroup validationState={getNumberValidation(input.cadNumber)}>
            <TitleLabel>8. CAD Number</TitleLabel>
            <FormControl data-section={section} name='cadNumber' value={input.cadNumber} onChange={handleTextInput} disabled={isInReview()} />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <TitleLabel>9. On View</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='onView'
              value={true}
              checked={input.onView === 'true'}
              onChange={handleSingleSelection}
              disabled={isInReview()}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name ='onView'
              value={false}
              checked={input.onView === 'false'}
              onChange={handleSingleSelection}
              disabled={isInReview()}>No</InlineRadio>
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={6}>
          <FormGroup validationState={getDateValidation(input.dateOccurred)}>
            <TitleLabel>10. Date Occurred</TitleLabel>
            <DatePicker value={input.dateOccurred} onChange={(e) => {handleDateInput(e, section, 'dateOccurred')}} disabled={isInReview()} />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <TitleLabel>Time Occurred</TitleLabel>
          <TimePicker value={input.timeOccurred} onChange={(e) => {handleTimeInput(e, section, 'timeOccurred')}} disabled={isInReview()} />
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>11. Date Reported</TitleLabel>
          <DatePicker value={input.dateReported} onChange={(e) => {handleDateInput(e, section, 'dateReported')}} disabled={isInReview()} />
        </Col>
        <Col lg={6}>
          <TitleLabel>Time Reported</TitleLabel>
          <TimePicker value={input.timeReported} onChange={(e) => {handleTimeInput(e, section, 'timeReported')}} disabled={isInReview()} />
        </Col>
      </PaddedRow>

      { !isInReview() ? <FormNav nextPath={FORM_PATHS.CONSUMER_SEARCH} handlePageChange={handlePageChange} /> : null}
		</div>

	);
}

ReportInfoView.propTypes = {
  input: PropTypes.object.isRequired,
  handleTextInput: PropTypes.func.isRequired,
  handleDateInput: PropTypes.func.isRequired,
  handleTimeInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  isInReview: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired
}

export default ReportInfoView;
