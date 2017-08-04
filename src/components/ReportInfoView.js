/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';

import SectionView from './SectionView';
import { Row, Label, TitleLabel, TextInput, InputWrapper, InlineRadio } from '../shared/Layout';

const ReportInfoView = ({ section, handleInput, handleSingleSelection, input }) => {

	return (
		<SectionView header='Report Information'>
      <Row>
        <InputWrapper>
    		  <TitleLabel>1. Primary Reason for Dispatch</TitleLabel>
          <TextInput data-section={section} name='1' value={input[1]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>2. Complaint Number</TitleLabel>
          <TextInput data-section={section} name='2' value={input[2]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>3. Comparison Offense Report Prepared</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name='3'
              value='yes'
              checked={input[3] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <input
              type='radio'
              data-section={section}
              name ='3'
              value='no'
              checked={input[3] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>4. Crime / Incident</TitleLabel>
          <TextInput data-section={section} name='4' value={input[4]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>5. Location of Offense / Incident (exact street address, if applicable)</TitleLabel>
          <TextInput data-section={section} name='5' value={input[5]} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>6. Unit</TitleLabel>
          <TextInput data-section={section} name='6' value={input[6]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>7. Post of Occurrence</TitleLabel>
          <TextInput data-section={section} name='7' value={input[7]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>8. CAD Number</TitleLabel>
          <TextInput data-section={section} name='8' value={input[8]} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>9. On View</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name='9'
              value='yes'
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name ='9'
              value='no'
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>10. Date / Time Occurred</TitleLabel>
          <TextInput data-section={section} name='10' value={input[10]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>11. Date / Time Reported</TitleLabel>
          <TextInput data-section={section} name='11' value={input[11]} onChange={handleInput} />
        </InputWrapper>
      </Row>
		</SectionView>

	);
}

export default ReportInfoView;
