/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { FormGroup, FormControl } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';

import SectionView from './SectionView';
import { Row, Label, TitleLabel, InputWrapper, InlineRadio } from '../shared/Layout';
import { FLEX } from '../shared/Consts';

const ReportInfoView = ({ section, handleInput, handleDateInput, handleSingleSelection, input }) => {

	return (
		<SectionView header='Report Information'>
      <Row>
        <InputWrapper>
    		  <TitleLabel>1. Primary Reason for Dispatch</TitleLabel>
          <FormControl data-section={section} name='dispatchReason' value={input.dispatchReason} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>2. Complaint Number</TitleLabel>
          <FormControl data-section={section} name='complaintNumber' value={input.complaintNumber} onChange={handleInput} />
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
          <FormControl data-section={section} name='incident' value={input.incident} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_2_3}>
          <TitleLabel>5. Location of Offense / Incident (exact street address, if applicable)</TitleLabel>
          <FormControl data-section={section} name='locationOfIncident' value={input.locationOfIncident} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>6. Unit</TitleLabel>
          <FormControl data-section={section} name='unit' value={input.unit} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>7. Post of Occurrence</TitleLabel>
          <FormControl data-section={section} name='postOfOccurrence' value={input.postOfOccurrence} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>8. CAD Number</TitleLabel>
          <FormControl data-section={section} name='cadNumber' value={input.cadNumber} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
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
        <InputWrapper>
          <TitleLabel>10. Date / Time Occurred</TitleLabel>
          <DatePicker value={input.dateOccurred} onChange={(e) => {handleDateInput(e, section, 'dateOccurred')}} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>11. Date / Time Reported</TitleLabel>
          <DatePicker value={input.dateReported} onChange={(e) => {handleDateInput(e, section, 'dateReported')}} />
        </InputWrapper>
      </Row>
		</SectionView>

	);
}

ReportInfoView.propTypes = {
  handleInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
}

export default ReportInfoView;
