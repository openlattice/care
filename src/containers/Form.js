import React from 'react';
import PropTypes from 'prop-types';

import FormView from '../components/FormView';

class Form extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			// will host nested state for each section's inputs
		};
	}

	render() {
		return (
			<FormView />
		);
	}
}

export default Form;
