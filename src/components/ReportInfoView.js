/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';

const ReportInfoView = () => {
	return (
		<SectionView>
			<FormGroup>
				<ControlLabel>c's label</ControlLabel>
				<FormControl></FormControl>
				<Checkbox></Checkbox>
			</FormGroup>
		</SectionView>
	);
}

export default ReportInfoView;
