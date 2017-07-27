import React from 'react';
import PropTypes from 'prop-types';
import { EdmApi, DataApi } from 'loom-data';

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
				'14c': '',
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
		this.handleSingleSelection = this.handleSingleSelection.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
	}

	// For text input
	handleInput(e) {
		const sectionKey = e.target.dataset.section
		const name = e.target.name;
		const input = e.target.value;
		const sectionState = this.state[sectionKey]; 
		sectionState[name] = input;
		this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
	}

	// For radio or select input
	handleSingleSelection(e) {
		const sectionKey = e.target.dataset.section;
		const sectionState = this.state[sectionKey];
		sectionState[e.target.name] = e.target.value;
		this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
	}

	handleCheckboxChange(e) {
		const sectionKey = e.target.dataset.section;
		const sectionState = this.state[sectionKey];
		const idx = sectionState[e.target.name].indexOf(e.target.value);
		console.log('checkbox sectionState before addition', sectionState);
		if (idx === -1) {
			console.log('does not exist');
			sectionState[e.target.name].push(e.target.value);
		} else {
			console.log('does exist, idx:', idx);
			sectionState[e.target.name].splice(idx, 1);
		}
		console.log('checkbox sectionState before saving:', sectionState);
		this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
	}

	handleSubmit() {
		// send request to backend, submitting state data


		/* EXAMPLE API USAGE (Gallery: NewEdmObjectInput.js) */

		// case EdmConsts.PROPERTY_TYPE_TITLE: {
		//   const propertyType = new PropertyTypeBuilder()
		//     .setType(fqn)
		//     .setTitle(this.state[TITLE_FIELD])
		//     .setDescription(this.state[DESCRIPTION_FIELD])
		//     .setDataType(this.state.datatype)
		//     .build();
		//   propertyType.piiField = this.state.pii;
		//   propertyType.analyzer = (this.state.datatype === STRING && this.state.phonetic) ?
		//     EdmConsts.ANALYZERS.metaphone : EdmConsts.ANALYZERS.standard;
		//   return EntityDataModelApi.createPropertyType(propertyType);
		// }

		// case EdmConsts.ENTITY_TYPE_TITLE: {
		//   const propertyTypes = this.state.propertyTypes.map((propertyType) => {
		//     return propertyType.id;
		//   });
		//   const entityType = new EntityTypeBuilder()
		//     .setType(fqn)
		//     .setTitle(this.state[TITLE_FIELD])
		//     .setDescription(this.state[DESCRIPTION_FIELD])
		//     .setPropertyTypes(propertyTypes)
		//     .setKey(this.state.pKeys)
		//     .setCategory(SecurableTypes.EntityType)
		//     .build();
		//   return EntityDataModelApi.createEntityType(entityType);
		// }

		/* Gallery: (CreateEntitySetEpic.js) */
		// function createEntitySet(entitySet) {
		//   return Observable.from(EntityDataModelApi.createEntitySets([entitySet]))
		//     .map((response) => {
		//       return Object.assign({}, entitySet, {
		//         id: response[entitySet.name]
		//       });
		//     })
		//     .mergeMap((savedEntitySet) => {
		//       const reference = {
		//         collection: COLLECTIONS.ENTITY_TYPE,
		//         id: savedEntitySet.id
		//       };
		//       return Observable.of(
		//         actionFactories.createEntitySetResolve(reference)
		//       );
		//     })
		//     .catch(() => {
		//       return Observable.of(
		//         actionFactories.createEntitySetReject('Error saving entity set')
		//       );
		//     });
		// }

		// // TODO: Cancellation and Error handling
		// function createEntitySetEpic(action$) {
		//   return action$.ofType(actionTypes.CREATE_ENTITY_SET_REQUEST)
		//   // Run search
		//     .map(action => action.entitySet)
		//     .mergeMap(createEntitySet);
		// }
	}

	render() {
		return (
			<div>
				<ReportInfoView
						handleInput={this.handleInput}
						handleSingleSelection={this.handleSingleSelection}
						input={this.state.reportInfo}
						section='reportInfo' />
				<ConsumerInfoView
						handleInput={this.handleInput}
						handleSingleSelection={this.handleSingleSelection}
						handleCheckboxChange={this.handleCheckboxChange}
						input={this.state.consumerInfo}
						section='consumerInfo' />
			</div>
		);
	}
}

export default Form;
// TODO: Alter formview to take children / consolidate.
