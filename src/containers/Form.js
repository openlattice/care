import React from 'react';
import PropTypes from 'prop-types';

import ReportInfoView from '../components/ReportInfoView';

class Form extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			reportInfo: {
				1: '',
				2: '',
				3: ''
			}
		};

		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		const sectionKey = e.target.dataset.section
		const num = e.target.dataset.num;
		const input = e.target.value;
		const sectionState = this.state[sectionKey]; 
		sectionState[num] = input;
		this.setState({ [sectionKey]: sectionState }, () => {console.log('state:', this.state)});
	}

	render() {
		return (
			<ReportInfoView
					handleInput={this.handleInput}
					input={this.state.reportInfo}/>
		);
	}
}

export default Form;
// NEXT: LOAD PIECE OF STATE INTO EACH SECTION // HELPER FUNCTION FOR CHUNKING
// NEXT: create controlled component
// TODO: Alter formview to take children / consolidate.
