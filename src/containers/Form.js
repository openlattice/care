import React from 'react';
import PropTypes from 'prop-types';

import ReportInfoView from '../components/ReportInfoView';
import ConsumerInfoView from '../components/ConsumerInfoView';

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
			},
			consumerInfo: {
				'13a': '',
				'13b': '',
				'13c': '',
				'14a': null,
				'14b': '',
				'14c': null,
				'14d': '',
				'14e': '',
				15: null,
				16: null,
				'17a': null,
				'17b': null,
				18: null,
				19: [],
				20: null,
				21: null,
				22: [],
				23: [],
				24: [],
				25: null
			}
		};

		this.handleInput = this.handleInput.bind(this);
		this.handleRadioChange = this.handleRadioChange.bind(this);
	}

	handleInput(e) {
		const sectionKey = e.target.dataset.section
		const name = e.target.name;
		const input = e.target.value;
		const sectionState = this.state[sectionKey]; 
		sectionState[name] = input;
		this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
	}

	handleRadioChange(e) {
		const sectionKey = e.target.dataset.section;
		const sectionState = this.state[sectionKey];
		sectionState[e.target.name] = e.target.value;
		this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
	}

	// handleCheckboxChange
	//handleSubmit

	render() {
		return (
			<div>
				<ReportInfoView
						handleInput={this.handleInput}
						handleRadioChange={this.handleRadioChange}
						input={this.state.reportInfo}
						section='reportInfo' />
				<ConsumerInfoView
						handleInput={this.handleInput}
						handleRadioChange={this.handleRadioChange}
						input={this.state.consumerInfo}
						section='consumerInfo' />
			</div>
		);
	}
}

export default Form;
// NEXT: Handle selection
// NEXT: Handle checkbox 
// TODO: Alter formview to take children / consolidate.
