/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import Form from '../containers/Form';

function FormView() {
	return (
		<form>
			<div>Behavioral Health Report</div>
			<div>Baltimore Police Department</div>
			<Form />
		</form>
	);
}

export default FormView;
