import React from 'react';
import PropTypes from 'prop-types';
import { EntityDataModelApi, DataApi } from 'lattice';
import Promise from 'bluebird';

import FormView from '../components/FormView';
import ConfirmationModal from '../components/ConfirmationModalView';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reportInfo: {
        dispatchReason: '',
        complaintNumber: '',
        companionOffenseReport: null,
        incident: '',
        locationOfIncident: '',
        unit: '',
        postOfOccurrence: '',
        cadNumber: '',
        onView: null,
        dateOccurred: '',
        dateReported: ''
      },
      consumerInfo: {
        name: '',
        address: '',
        phone: '',
        militaryStatus: null,
        gender: '',
        race: '',
        age: '',
        dob: '',
        homeless: null,
        homelessLocation: '',
        drugsAlcohol: null,
        drugType: '',
        prescribedMedication: null,
        takingMedication: null,
        prevPsychAdmission: null,
        selfDiagnosis: [],
        selfDiagnosisOther: '',
        armedWithWeapon: null,
        armedWeaponType: '',
        accessToWeapons: null,
        accessibleWeaponType: '',
        observedBehaviors: [],
        observedBehaviorsOther: '',
        emotionalState: [],
        emotionalStateOther: '',
        photosTakenOf: [],
        injuries: [],
        injuriesOther: '',
        suicidal: null,
        suicidalActions: [],
        suicideAttemptMethod: [],
        suicideAttemptMethodOther: ''
      },
      complainantInfo: {
        complainantName: '',
        complainantAddress: '',
        complainantConsumerRelationship: '',
        complainantPhone: ''
      },
      dispositionInfo: {
        disposition: [],
        hospitalTransport: [],
        hospital: '',
        deescalationTechniques: [],
        deescalationTechniquesOther: '',
        specializedResourcesCalled: [],
        incidentNarrative: ''
      },
      officerInfo: {
        officerName: '',
        officerSeqID: '',
        officerInjuries: '',
        officerCertification: []
      },
      entitySetId: '',
      entitySet: {},
      entityType: {},
      propertyTypes: [],
      submitSuccess: null,
      submitFailure: null
    };

    this.initialReportState = Object.assign({}, this.state.reportInfo);
    this.initialConsumerState = Object.assign({}, this.state.consumerInfo);
    this.initialComplainantState = Object.assign({}, this.state.complainantInfo);
    this.initialDispositionState = Object.assign({}, this.state.dispositionInfo);
    this.initialOfficerState = Object.assign({}, this.state.officerInfo);
  }

  componentDidMount() {
    console.log('report state:', this.initialReportState);
    EntityDataModelApi.getEntitySetId('baltimoreHealthReport')
    .then((id) => {
      console.log('entity set id:', id);
      this.setState({entitySetId: id});
      EntityDataModelApi.getEntitySet(id)
      .then((entitySet) => {
        console.log('entity set:', entitySet);
        this.setState({entitySet});
        EntityDataModelApi.getEntityType(entitySet.entityTypeId)
        .then((entityType) => {
          console.log('entityType:', entityType);
          this.setState({entityType});
          Promise.map(entityType.properties, (propertyId) => {
            return EntityDataModelApi.getPropertyType(propertyId);
          })
          .then((propertyTypes) => {
            console.log('propertyTypes', propertyTypes);
            this.setState({propertyTypes});
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
    const formattedInput = Number(input) ? Number(input) : input;
    console.log('formattedInput:', formattedInput);
    sectionState[name] = formattedInput;
    this.setState({ [sectionKey]: sectionState }, () => {console.log('section state', this.state[sectionKey])});
  }

  // For radio or select input
  handleSingleSelection = (e) => {
    const sectionKey = e.target.dataset.section;
    const sectionState = this.state[sectionKey];
    sectionState[e.target.name] = e.target.value;
    console.log('boolean:', e.target.value);
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

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('SUBMIT!');
    // QUESTION: What is optimal way to flatten state for property value lookup? 
      // 1. Can flatten initial state, and pass entire object down to components (seems unneseccary)
      // 2. Can create new object w/ section states assigned to it (as below), but duplicates state object
      // 3. Can iterate through the section states' values to find match (seems time-consuming);
    const formInputs = Object.assign(
      {},
      this.state.reportInfo,
      this.state.consumerInfo,
      this.state.complainantInfo,
      this.state.dispositionInfo,
      this.state.officerInfo
    );

    const formattedValues = {};
    this.state.propertyTypes.forEach((propertyType) => {
      const value = formInputs[propertyType.type.name];
      let formattedValue;
      // [], [""], ["hi"], "", "hi"
      formattedValue = Array.isArray(value) ? value : [value];
      console.log('FORMATTED VALUE TO ARRAY', formattedValue);
      formattedValue = (formattedValue.length === 1 && formattedValue[0] === "false") ? [false] : formattedValue;
      formattedValue = (formattedValue.length === 1 && formattedValue[0] === "true") ? [true] : formattedValue;
      formattedValue = (formattedValue.length > 0 && (formattedValue[0] === "" || formattedValue[0] === null)) ? [] : formattedValue;
      console.log('FORMATTEED VALUE FINAL:', formattedValue);
      formattedValues[propertyType.id] = formattedValue;
      // formattedValues[propertyType.id] = Array.isArray(value) ? value : [value];
    });
    console.log('formattedValues:', formattedValues);

    const primaryKeys = this.state.entityType.key;
    const entityKey = primaryKeys.map((keyId) => {
      console.log('keyID:', keyId);
      const utf8Val = (formattedValues[keyId].length > 0) ? encodeURI(formattedValues[keyId][0]) : '';
      return btoa(utf8Val);
    }).join(',');
    console.log('entityKey:', entityKey);

    const entities = {
      [entityKey]: formattedValues
    };
    console.log('entities', entities);

    DataApi.createEntityData(this.state.entitySetId, '', entities)
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
      });
    });
  }

//QUESTION: Is there a better way to reset state?
  handleModalButtonClick = () => {
    window.location.reload();
  }

  render() {
    return (
      <div>
        <FormView
            handleInput={this.handleInput}
            handleSingleSelection={this.handleSingleSelection}
            handleCheckboxChange={this.handleCheckboxChange}
            handleSubmit={this.handleSubmit}
            input={this.state} />
        {
          this.state.submitSuccess ? 
          <ConfirmationModal 
              submitSuccess={this.state.submitSuccess}
              submitFailure={this.state.submitFailure}
              handleModalButtonClick={this.handleModalButtonClick} /> :
          null
        }
      </div>
    );
  }
}

export default Form;
