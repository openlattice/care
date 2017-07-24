/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox, Radio } from 'react-bootstrap';

import SectionView from './SectionView';

const ReportInfoView = ({ handleInput, handleRadioChange, input }) => {
  console.log('input3', input[3]);
	return (
		<SectionView header='Report Info'>
			<FormGroup>
        <div className='flexRow'>
  				  <ControlLabel>1. Primary Reason for Dispatch
              <FormControl data-section='reportInfo' data-num='1' value={input[1]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>2. Complaint Number
              <FormControl data-section='reportInfo' data-num='2' value={input[2]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>3. Comparison Offense Report Prepared
              <ControlLabel><Radio name='3' value='yes' data-section='reportInfo' onChange={handleRadioChange}></Radio>Yes</ControlLabel>
              <ControlLabel><Radio name ='3' value='no' data-section='reportInfo' onChange={handleRadioChange}></Radio>No</ControlLabel>
            </ControlLabel>
            <ControlLabel>4. Crime / Incident
              <FormControl data-section='reportInfo' data-num='2' value={input[2]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>5. Location of Offense / Incident (exact street address)
              <FormControl data-section='reportInfo' data-num='2' value={input[2]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>6. Unit
              <FormControl data-section='reportInfo' data-num='2' value={input[2]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>7. Post
              <FormControl data-section='reportInfo' data-num='2' value={input[2]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>8. CAD Number
              <FormControl data-section='reportInfo' data-num='2' value={input[2]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>9. On View
              <ControlLabel><Radio name='3' value='yes' checked={input[3] === 'yes'} onChange={handleRadioChange}></Radio>Yes</ControlLabel>
              <ControlLabel><Radio name ='3' value='no' checked={input[3] === 'no'} onChange={handleRadioChange}></Radio>No</ControlLabel>
            </ControlLabel>
            <ControlLabel>10. Date / Time Occurred
              <FormControl data-section='reportInfo' data-num='2' value={input[2]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>11. Date / Time Reported
              <FormControl data-section='reportInfo' data-num='2' value={input[2]} onChange={handleInput}></FormControl>
            </ControlLabel>
        </div>
			</FormGroup>
		</SectionView>

	);
}

export default ReportInfoView;

// CONSIDERATION: add section data to formgroup / sectionview to avoid redundancy
// move onChange to section re: redundancy?
// use 'name' instead of data-section
