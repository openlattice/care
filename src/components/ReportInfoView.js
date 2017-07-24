/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox, Radio } from 'react-bootstrap';

import SectionView from './SectionView';

const ReportInfoView = ({ section, handleInput, handleRadioChange, input }) => {
  console.log('input3', input[3]);
	return (
		<SectionView header='Report Info'>
			<FormGroup>
        <div>
  				  <ControlLabel>1. Primary Reason for Dispatch
              <FormControl data-section={section} name='1' value={input[1]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>2. Complaint Number
              <FormControl data-section={section} name='2' value={input[2]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>3. Comparison Offense Report Prepared
              <ControlLabel>
                <input
                    type='radio'
                    data-section={section}
                    name='3' value='yes'
                    checked={input[3] === 'yes'}
                    onChange={handleRadioChange} />Yes
              </ControlLabel>
              <ControlLabel>
                <input
                    type='radio'
                    data-section={section}
                    name ='3' value='no'
                    checked={input[3] === 'no'}
                    onChange={handleRadioChange} />No
              </ControlLabel>
            </ControlLabel>
            <ControlLabel>4. Crime / Incident
              <FormControl data-section={section} name='4' value={input[4]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>5. Location of Offense / Incident (exact street address)
              <FormControl data-section={section} name='5' value={input[5]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>6. Unit
              <FormControl data-section={section} name='6' value={input[6]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>7. Post
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
                    onChange={handleRadioChange} />Yes
              </ControlLabel>
              <ControlLabel>
                <input
                    type='radio'
                    data-section={section}
                    name ='9'
                    value='no'
                    onChange={handleRadioChange} />No
              </ControlLabel>
            </ControlLabel>
            <ControlLabel>10. Date / Time Occurred
              <FormControl data-section={section} name='10' value={input[10]} onChange={handleInput}></FormControl>
            </ControlLabel>
            <ControlLabel>11. Date / Time Reported
              <FormControl data-section={section} name='11' value={input[11]} onChange={handleInput}></FormControl>
            </ControlLabel>
        </div>
			</FormGroup>
		</SectionView>

	);
}

export default ReportInfoView;
