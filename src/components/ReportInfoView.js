/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';

import SectionView from './SectionView';
import { Row, Label, TextInput, SingleSelectInput, InputWrapper } from '../shared/Layout';

const ReportInfoView = ({ section, handleInput, handleSingleSelection, input }) => {

	return (
		<SectionView header='Report Information'>

      <Row>
        <InputWrapper>
    		  <div><Label>1. Primary Reason for Dispatch</Label></div>
          <div><TextInput data-section={section} name='1' value={input[1]} onChange={handleInput} /></div>
        </InputWrapper>
        <InputWrapper>
          <div><Label>2. Complaint Number</Label></div>
          <div><TextInput data-section={section} name='2' value={input[2]} onChange={handleInput} /></div>
        </InputWrapper>
        <InputWrapper>
          <div><Label>3. Comparison Offense Report Prepared</Label></div>
          <div>
            <SingleSelectInput>
              <input
                  type='radio'
                  data-section={section}
                  name='3'
                  value='yes'
                  checked={input[3] === 'yes'}
                  onChange={handleSingleSelection} />
            </SingleSelectInput>
            <Label>Yes</Label>
            <SingleSelectInput>
              <input
                  type='radio'
                  data-section={section}
                  name ='3'
                  value='no'
                  checked={input[3] === 'no'}
                  onChange={handleSingleSelection} />
            </SingleSelectInput>
            <Label>No</Label>
          </div>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <Label>4. Crime / Incident</Label>
          <TextInput data-section={section} name='4' value={input[4]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <Label>5. Location of Offense / Incident (exact street address, if applicable)</Label>
          <TextInput data-section={section} name='5' value={input[5]} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <Label>6. Unit</Label>
          <TextInput data-section={section} name='6' value={input[6]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <Label>7. Post of Occurrence</Label>
          <TextInput data-section={section} name='7' value={input[7]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <Label>8. CAD Number</Label>
          <TextInput data-section={section} name='8' value={input[8]} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <Label>9. On View</Label>
          <SingleSelectInput>
            <input
                type='radio'
                data-section={section}
                name='9'
                value='yes'
                onChange={handleSingleSelection} />
          </SingleSelectInput>
          <Label>Yes</Label>
          <SingleSelectInput>
            <input
                type='radio'
                data-section={section}
                name ='9'
                value='no'
                onChange={handleSingleSelection} />
            <Label>No</Label>
          </SingleSelectInput>
        </InputWrapper>
        <InputWrapper>
          <Label>10. Date / Time Occurred</Label>
          <TextInput data-section={section} name='10' value={input[10]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <Label>11. Date / Time Reported</Label>
          <TextInput data-section={section} name='11' value={input[11]} onChange={handleInput} />
        </InputWrapper>
      </Row>
		</SectionView>

	);
}

export default ReportInfoView;
