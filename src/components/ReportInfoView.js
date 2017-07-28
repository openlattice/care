/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox, Radio } from 'react-bootstrap';
import styled, { injectGlobal } from 'styled-components';

import SectionView from './SectionView';
import { Row, Label, TextInput, RadioInput } from '../shared/Layout';

const ReportInfoView = ({ section, handleInput, handleSingleSelection, input }) => {

	return (
		<SectionView header='Report Information'>
      <Row>
  		  <Label>1. Primary Reason for Dispatch</Label>
        <TextInput data-section={section} name='1' value={input[1]} onChange={handleInput} />
        <Label>2. Complaint Number</Label>
        <TextInput data-section={section} name='2' value={input[2]} onChange={handleInput} />
        <Label>3. Comparison Offense Report Prepared</Label>
        <Label>
          <input
              type='radio'
              data-section={section}
              name='3'
              value='yes'
              checked={input[3] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </Label>
        <Label>
          <input
              type='radio'
              data-section={section}
              name ='3'
              value='no'
              checked={input[3] === 'no'}
              onChange={handleSingleSelection} />No
        </Label>

      </Row>
      <Row>
        <ControlLabel>4. Crime / Incident
          <FormControl data-section={section} name='4' value={input[4]} onChange={handleInput}></FormControl>
        </ControlLabel>
        <ControlLabel>5. Location of Offense / Incident (exact street address, if applicable)
          <FormControl data-section={section} name='5' value={input[5]} onChange={handleInput}></FormControl>
        </ControlLabel>
      </Row>
      <Row>
        <ControlLabel>6. Unit
          <FormControl data-section={section} name='6' value={input[6]} onChange={handleInput}></FormControl>
        </ControlLabel>
        <ControlLabel>7. Post of Occurrence
          <FormControl data-section={section} name='7' value={input[7]} onChange={handleInput}></FormControl>
        </ControlLabel>
        <ControlLabel>8. CAD Number
          <FormControl data-section={section} name='8' value={input[8]} onChange={handleInput}></FormControl>
        </ControlLabel>
        <ControlLabel>9. On View
          <ControlLabel>
            <input
                type='radio'
                data-section={section}
                name='9'
                value='yes'
                onChange={handleSingleSelection} />Yes
          </ControlLabel>
          <ControlLabel>
            <input
                type='radio'
                data-section={section}
                name ='9'
                value='no'
                onChange={handleSingleSelection} />No
          </ControlLabel>
        </ControlLabel>
        <ControlLabel>10. Date / Time Occurred
          <FormControl data-section={section} name='10' value={input[10]} onChange={handleInput}></FormControl>
        </ControlLabel>
        <ControlLabel>11. Date / Time Reported
          <FormControl data-section={section} name='11' value={input[11]} onChange={handleInput}></FormControl>
        </ControlLabel>
      </Row>
		</SectionView>

	);
}

export default ReportInfoView;
