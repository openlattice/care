import React from 'react';
import PropTypes from 'prop-types';
import { EntityDataModelApi, DataApi } from 'lattice';
import Promise from 'bluebird';

import FormView from '../components/FormView';

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
				'15a': null,
				'15b': '',
				'16a': null,
				'16b': '',
				'17a': null,
				'17b': null,
				18: null,
				'19a': [],
				'19b': '',
				'20a': null,
				'20b': '',
				'21a': null,
				'21b': '',
				'22a': [],
				'22b': '',
				'22c': [],
				'22d': '',
				23: [],
				'24a': [],
				'24b': '',
				'25a': null,
				'25b': [],
				'26a': [],
				'26b': ''
			},
			complainantInfo: {
				'27a': '',
				'27b': '',
				'27c': '',
				'27d': ''
			},
			dispositionInfo: {
				'28a': [],
				'28b': [],
				'28c': '',
				'29a': [],
				'29b': '',
				30: [],
				31: ''
			},
			officerInfo: {
				32: '',
				34: '',
				35: '',
				36: [],
				'37a': '',
				'37b': ''
			},
			entitySetId: '',
			entitySet: {},
			entityType: {},
			propertyTypes: [],
			submitSuccess: null,
			submitFailure: null
		};
	}

	componentDidMount() {
			EntityDataModelApi.getEntitySetId('baltimorehealthreporttest1')
			.then((id) => {
				console.log('entity set id:', id);
				this.setState({entitySetId: id});
				EntityDataModelApi.getEntitySet(id)
				.then((entitySet) => {
					console.log('entity set:', entitySet);
					this.setState({entitySet});
					EntityDataModelApi.getEntityType(entitySet.entityTypeId) // entityType contains property types
					.then((entityType) => {
						console.log('entityType:', entityType);
						this.setState({entityType});
						Promise.map(entityType.properties, (propertyId) => {
		        	return EntityDataModelApi.getPropertyType(propertyId);
						})
						.then((propertyTypes) => {
							console.log('propertyTypes', propertyTypes); // == authorizedPropertyTypes
							this.setState({propertyTypes}, () => {
								console.log('STATE AFTER GETTING ALL THE SHIT:', this.state);
							});
						});
					});
				});
			});
		}

	// For text input
	handleInput = (e) => {
		const sectionKey = e.target.dataset.section
		const name = e.target.name;
		const input = e.target.value;
		const sectionState = this.state[sectionKey]; 
		sectionState[name] = input;
		this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
	}

	// For radio or select input
	handleSingleSelection = (e) => {
		const sectionKey = e.target.dataset.section;
		const sectionState = this.state[sectionKey];
		sectionState[e.target.name] = e.target.value;
		this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
	}

	handleCheckboxChange = (e) => {
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

	// EXAMPLE ENTITIES FROM ADD DATA FORM
	// const entities = {
	// 	'ccHVycGxl': {
	// 		'135f73d5-4d91-4735-97bc-09fb1e72555b': ["soft"],
	// 		'01703452-0cd6-4bb6-a8f4-ba2d8ef43c26': ["purple"]
	// 	};

	// PROBLEMS
	// 400 on createEntityData
		// Looks like entities format is incorrect. What is the entityKey?
	// Get entitySetId & propertyTypeIds -> how to match state keys w/ property type ids?
		// For each property key (state key), get propertyTypeId... create new object w/ ids as keys, then use this as entities arg


// TODO: move everything thru getting property types -> componentDidMount
// TODO: get primary keys
	// generateEntities = () => {
	//   const { propValues, authorizedPropertyTypes } = this.state;
	//   console.log('propValues:', propValues);
	//   console.log('authorizedPropertyTypes:', authorizedPropertyTypes.toJS());
	//   const localDateTimes = {};
	//   authorizedPropertyTypes.forEach((propertyType :Map) => {
	//     if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.get('datatype'))) {
	//       const propertyTypeId :string = propertyType.get('id');
	//       localDateTimes[propertyTypeId] = [moment(propValues[propertyTypeId]).format('YYYY-MM-DDThh:mm:ss')];
	//     }
	//   });
	//   const formattedValues = Object.assign({}, propValues, localDateTimes); // are localDateTimes required?
	//   console.log('formattedValues:', formattedValues);
	//   const entityKey = this.props.primaryKey.map((keyId) => {
	//     console.log('keyId:', keyId);
	//     const utf8Val = (formattedValues[keyId].length > 0) ? encodeURI(formattedValues[keyId][0]) : '';
	//     console.log('utf8val:', utf8Val);
	//     console.log('btoa utf8:', btoa(utf8Val));
	//     return btoa(utf8Val);
	//   }).join(',');
	//   console.log('entityKey:', entityKey);
	//   // MTAwMSUyMFBlcmVyZW5hbg==,VW5pdmVyc2U=
	//   console.log('formattedValues after primaryKey mapping:', formattedValues);
	//   // {
	//   //   '062ff81e-417c-4a67-9906-380b4a0865b2': ["1001 Pererenan"], //address
	//   //   '77e7ceb2-ec2e-494c-b62f-e013d8d3541b': ["Universe"] // name
	//   // }
	//   return { [entityKey]: formattedValues };
	// }

	generateEntities = () => {
	  const { propValues, authorizedPropertyTypes } = this.state;
	  console.log('propValues:', propValues);
	  console.log('authorizedPropertyTypes:', authorizedPropertyTypes.toJS());
	  const localDateTimes = {};
	  authorizedPropertyTypes.forEach((propertyType :Map) => {
	    if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.get('datatype'))) {
	      const propertyTypeId :string = propertyType.get('id');
	      localDateTimes[propertyTypeId] = [moment(propValues[propertyTypeId]).format('YYYY-MM-DDThh:mm:ss')];
	    }
	  });
	  const formattedValues = Object.assign({}, propValues, localDateTimes); // are localDateTimes required?
	  console.log('formattedValues:', formattedValues);
	  const entityKey = this.props.primaryKey.map((keyId) => {
	    console.log('keyId:', keyId);
	    const utf8Val = (formattedValues[keyId].length > 0) ? encodeURI(formattedValues[keyId][0]) : '';
	    console.log('utf8val:', utf8Val);
	    console.log('btoa utf8:', btoa(utf8Val));
	    return btoa(utf8Val);
	  }).join(',');
	  console.log('entityKey:', entityKey);
	  // MTAwMSUyMFBlcmVyZW5hbg==,VW5pdmVyc2U=
	  console.log('formattedValues after primaryKey mapping:', formattedValues);
	  // {
	  //   '062ff81e-417c-4a67-9906-380b4a0865b2': ["1001 Pererenan"], //address
	  //   '77e7ceb2-ec2e-494c-b62f-e013d8d3541b': ["Universe"] // name
	  // }
	  return { [entityKey]: formattedValues };
	}

	//TODO: try/catch error in/after propertyTypes block;
	handleSubmit = (e) => {
		e.preventDefault();
		console.log('SUBMIT!');
		let entitySetId = '';

		EntityDataModelApi.getEntitySetId('baltimorehealthreporttest1')
		.then((id) => {
			console.log('entity set id:', id);
			entitySetId = id;
			EntityDataModelApi.getEntitySet(id)
			.then((entitySet) => {
				console.log('entity set:', entitySet);
				EntityDataModelApi.getEntityType(entitySet.entityTypeId) // entityType contains property types
				.then((entityType) => {
					console.log('entityType:', entityType);
					Promise.map(entityType.properties, (propertyId) => {
	        	return EntityDataModelApi.getPropertyType(propertyId);
					})
					.then((propertyTypes) => {
						console.log('propertyTypes', propertyTypes); // == authorizedPropertyTypes
						// TODO: format entities correctly. e.g. {[entityKey]: {propertyKey: val, propertyKey: val}}
						// TODO: get entityKey / what is the entityKey?
						const entityKey = 'something';
						// string mapping to setMultiMap; i
						const entities = {
							[entityKey]: {

							}
						};
						propertyTypes.forEach((propertyType) => {
							// TODO: flatten state & make change keys to strings that match propertyType names, e.g. 'disposition', for easier lookup here by propertyType
							// check that 'title' and 'id' are correct keys
							entities[entityKey][propertyType.id] = this.state[propertyType.title];
						});
						console.log('entitySetId:', entitySetId);

					});
				});
			});
		});

		DataApi.createEntityData(entitySetId, '', entities)
		.then((res) => {
			console.log('success! res:', res);
			this.setState({
				submitSuccess: true,
				submitFailure: false				
			});
		})
		.catch((err) => {
			console.log('err!', err);
			this.setState({
				submitSuccess: false,
				submitFailure: true
			})
		});
	}

	render() {
		return (
			<FormView
					handleInput={this.handleInput}
					handleSingleSelection={this.handleSingleSelection}
					handleCheckboxChange={this.handleCheckboxChange}
					handleSubmit={this.handleSubmit}
					input={this.state} />
		);
	}
}

export default Form;
