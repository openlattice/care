/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { FormGroup, FormControl } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';

import SectionView from './SectionView';
import { Row, Label, TitleLabel, InputWrapper, InlineRadio } from '../shared/Layout';
import { FLEX } from '../shared/Consts';

const ReportInfoView = ({ section, handleTextInput, handleDateInput, handleTimeInput, handleSingleSelection, input }) => {

	return (
		<SectionView header='Report Information'>
      <Row>
        <InputWrapper>
    		  <TitleLabel>1. Primary Reason for Dispatch</TitleLabel>
          <FormControl data-section={section} name='dispatchReason' value={input.dispatchReason} onChange={handleTextInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>2. Complaint Number</TitleLabel>
          <FormControl data-section={section} name='complaintNumber' value={input.complaintNumber} onChange={handleTextInput} />
        </InputWrapper>
        <InputWrapper>
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
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>4. Crime / Incident</TitleLabel>
          <FormControl data-section={section} name='incident' value={input.incident} onChange={handleTextInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_2_3}>
          <TitleLabel>5. Location of Offense / Incident (exact street address, if applicable)</TitleLabel>
          <FormControl data-section={section} name='locationOfIncident' value={input.locationOfIncident} onChange={handleTextInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>6. Unit</TitleLabel>
          <FormControl data-section={section} name='unit' value={input.unit} onChange={handleTextInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>7. Post of Occurrence</TitleLabel>
          <FormControl data-section={section} name='postOfOccurrence' value={input.postOfOccurrence} onChange={handleTextInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>8. CAD Number</TitleLabel>
          <FormControl data-section={section} name='cadNumber' value={input.cadNumber} onChange={handleTextInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX.COL_1_5}>
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
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_5}>
          <TitleLabel>10. Date Occurred</TitleLabel>
          <DatePicker value={input.dateOccurred} onChange={(e) => {handleDateInput(e, section, 'dateOccurred')}} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_5}>
          <TitleLabel>Time Occurred</TitleLabel>
          <TimePicker value={input.timeOccurred} onChange={(e) => {handleTimeInput(e, section, 'timeOccurred')}} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_5}>
          <TitleLabel>11. Date Reported</TitleLabel>
          <DatePicker value={input.dateReported} onChange={(e) => {handleDateInput(e, section, 'dateReported')}} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_5}>
          <TitleLabel>Time Reported</TitleLabel>
          <TimePicker value={input.timeReported} onChange={(e) => {handleTimeInput(e, section, 'timeReported')}} />
        </InputWrapper>
      </Row>
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
