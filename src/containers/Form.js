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
				3: null,
				4: '',
				5: '',
				6: '',
				7: '',
				8: '',
				9: null,
				10: '',
				11: ''
			}
		};

		this.handleInput = this.handleInput.bind(this);
		this.handleRadioChange = this.handleRadioChange.bind(this);
	}

	handleInput(e) {
		const sectionKey = e.target.dataset.section
		const num = e.target.dataset.num;
		const input = e.target.value;
		const sectionState = this.state[sectionKey]; 
		sectionState[num] = input;
		this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
	}

	handleRadioChange(e) {
		console.log('name, val:', e.target.name, e.target.value);
		const sectionKey = e.target.dataset.section;
		const sectionState = this.state[sectionKey];
		sectionState[e.target.name] = e.target.value;
		this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
		// ALLOW TOGGLE ON/OFF
	}

	//handleSubmit

	render() {
		return (
			<ReportInfoView
					handleInput={this.handleInput}
					handleRadioChange={this.handleRadioChange}
					input={this.state.reportInfo}/>
		);
	}
}

export default Form;
// NEXT: controlled component for radio selection
// NEXT: Handle each section name
// NEXT: Create each section.
// NEXT: Handle checkbox selection
// TODO: Alter formview to take children / consolidate.
