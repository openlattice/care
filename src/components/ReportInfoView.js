/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { FormGroup, FormControl, Grid, Col } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';

import SectionView from './SectionView';
import { Label, TitleLabel, InlineRadio, PaddedRow } from '../shared/Layout';

const ReportInfoView = ({ section, handleTextInput, handleDateInput, handleTimeInput, handleSingleSelection, input }) => {

	return (
		<SectionView header='Report Information'>
      <PaddedRow>
        <Col lg={3}>
    		  <TitleLabel>1. Primary Reason for Dispatch</TitleLabel>
          <FormControl data-section={section} name='dispatchReason' value={input.dispatchReason} onChange={handleTextInput} />
        </Col>
        <Col lg={3}>
          <TitleLabel>2. Complaint Number</TitleLabel>
          <FormControl data-section={section} name='complaintNumber' value={input.complaintNumber} onChange={handleTextInput} />
        </Col>
        <Col lg={3}>
          <TitleLabel>3. Companion Offense Report Prepared</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='companionOffenseReport'
              value={true}
              checked={input.companionOffenseReport === 'true'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name ='companionOffenseReport'
              value={false}
              checked={input.companionOffenseReport === 'false'}
              onChange={handleSingleSelection}>No</InlineRadio>
        </Col>
        <Col lg={3}>
          <TitleLabel>4. Crime / Incident</TitleLabel>
          <FormControl data-section={section} name='incident' value={input.incident} onChange={handleTextInput} />
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={3}>
          <TitleLabel>5. Location of Offense / Incident</TitleLabel>
          <FormControl data-section={section} name='locationOfIncident' value={input.locationOfIncident} onChange={handleTextInput} />
        </Col>
        <Col lg={2}>
          <TitleLabel>6. Unit</TitleLabel>
          <FormControl data-section={section} name='unit' value={input.unit} onChange={handleTextInput} />
        </Col>
        <Col lg={3}>
          <TitleLabel>7. Post of Occurrence</TitleLabel>
          <FormControl data-section={section} name='postOfOccurrence' value={input.postOfOccurrence} onChange={handleTextInput} />
        </Col>
        <Col lg={2}>
          <TitleLabel>8. CAD Number</TitleLabel>
          <FormControl data-section={section} name='cadNumber' value={input.cadNumber} onChange={handleTextInput} />
        </Col>
        <Col lg={2}>
          <TitleLabel>9. On View</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='onView'
              value={true}
              checked={input.onView === 'true'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name ='onView'
              value={false}
              checked={input.onView === 'false'}
              onChange={handleSingleSelection}>No</InlineRadio>
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={3}>
          <TitleLabel>10. Date Occurred</TitleLabel>
          <DatePicker value={input.dateOccurred} onChange={(e) => {handleDateInput(e, section, 'dateOccurred')}} />
        </Col>
        <Col lg={3}>
          <TitleLabel>Time Occurred</TitleLabel>
          <TimePicker value={input.timeOccurred} onChange={(e) => {handleTimeInput(e, section, 'timeOccurred')}} />
        </Col>
        <Col lg={3}>
          <TitleLabel>11. Date Reported</TitleLabel>
          <DatePicker value={input.dateReported} onChange={(e) => {handleDateInput(e, section, 'dateReported')}} />
        </Col>
        <Col lg={3}>
          <TitleLabel>Time Reported</TitleLabel>
          <TimePicker value={input.timeReported} onChange={(e) => {handleTimeInput(e, section, 'timeReported')}} />
        </Col>
      </PaddedRow>
		</SectionView>

	);
}

ReportInfoView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
}

export default ReportInfoView;
