/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import ReportInfoView from './ReportInfoView';

function FormView(props) {
	return (
		<form>
			<div>Behavioral Health Report</div>
			<div>Baltimore Police Department</div>
			<ReportInfoView />
		</form>
	);
}

export default FormView;
