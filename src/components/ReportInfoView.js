/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox, Radio } from 'react-bootstrap';

import SectionView from './SectionView';

const ReportInfoView = ({ handleInput, input }) => {
	return (
		<SectionView header='Report Info'>
			<FormGroup>
				<ControlLabel>1. Primary Reason for Dispatch</ControlLabel>
				<FormControl data-section='reportInfo' data-num='1' value={input[1]} onChange={handleInput}></FormControl>
        <ControlLabel>2. Complaint Number</ControlLabel>
        <FormControl></FormControl>
        <ControlLabel>3. Comparison Offense Report Prepared</ControlLabel>
				<Radio></Radio><ControlLabel>Yes</ControlLabel>
        <Radio></Radio><ControlLabel>No</ControlLabel>
			</FormGroup>
		</SectionView>

	);
}

export default ReportInfoView;
