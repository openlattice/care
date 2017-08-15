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
        timeOccurred: '',
        dateReported: new Date().toISOString(),
        timeReported: ''
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
  }

  componentDidMount() {
    EntityDataModelApi.getEntitySetId('timeTestEntitySet')
    .then((id) => {
      this.setState({entitySetId: id});
      EntityDataModelApi.getEntitySet(id)
      .then((entitySet) => {
        this.setState({entitySet});
        EntityDataModelApi.getEntityType(entitySet.entityTypeId)
        .then((entityType) => {
          this.setState({entityType});
          Promise.map(entityType.properties, (propertyId) => {
            return EntityDataModelApi.getPropertyType(propertyId);
          })
          .then((propertyTypes) => {
            this.setState({propertyTypes}, () => {
              console.log('INITIAL STATE after GET:', this.state);
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
    const formattedInput = Number(input) ? Number(input) : input;
    sectionState[name] = formattedInput;
    this.setState({ [sectionKey]: sectionState }, () => {console.log('entities', this.getEntities())});
  }

  handleDateInput = (e, section, name) => {
    const input = e;
    const sectionState = this.state[section];
    sectionState[name] = input;
    this.setState({ [section]: sectionState }, () => {console.log('section state', this.state[section])})
  }

  formatTime = (seconds) => {
    let hh = 0;
    let mm = 0;
    let ss = seconds;

    while (ss >= 60) {
      mm++;
      ss = ss - 60;
    }

    while (mm >= 60) {
      hh++;
      mm = mm - 60;
    }

    let hhStr = hh.toString();
    hhStr = hhStr.length === 1 ? '0' + hhStr : hhStr;

    let mmStr = mm.toString();
    mmStr = mmStr.length === 1 ? '0' + mmStr : mmStr;

    let ssStr = ss.toString();
    ssStr = ssStr.length === 1 ? '0' + ssStr : ssStr;

    const res = hhStr + ':' + mmStr + ':' + ssStr;
    console.log('formatted time:', res);
    return res;
  }

  handleTimeInput = (e, section, name) => {
    console.log('handle time input, e:', e);
    const input = this.formatTime(e);
    const sectionState = this.state[section];
    sectionState[name] = input;
    this.setState({ [section]: sectionState }, () => {console.log('section state', this.state[section])});
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
    if (idx === -1) {
      sectionState[e.target.name].push(e.target.value);
    } else {
      sectionState[e.target.name].splice(idx, 1);
    }
    this.setState({ [sectionKey]: sectionState }, () => {console.log('section state:', this.state[sectionKey])});
  }

  getEntities = () => {
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
      formattedValue = Array.isArray(value) ? value : [value];
      console.log('first run:', formattedValue);
      formattedValue = (formattedValue.length === 1 && formattedValue[0] === "false") ? [false] : formattedValue;
      formattedValue = (formattedValue.length === 1 && formattedValue[0] === "true") ? [true] : formattedValue;
      formattedValue = (formattedValue.length > 0 && (formattedValue[0] === "" || formattedValue[0] === null)) ? [] : formattedValue;
      formattedValues[propertyType.id] = formattedValue;
    });
    console.log('formattedValues:', formattedValues);

    const primaryKeys = this.state.entityType.key;
    // console.log('primaryKeys:', primaryKeys);
    const entityKey = primaryKeys.map((keyId) => {
      // console.log('formattedValue,i.e. is there a value?:', formattedValues[keyId]);
      const utf8Val = (formattedValues[keyId].length > 0) ? encodeURI(formattedValues[keyId][0]) : '';
      return btoa(utf8Val);
    }).join(',');

    const entities = {
      [entityKey]: formattedValues
    };
    // console.log('entities', entities);
    return entities;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const entities = this.getEntities();
    console.log('entities!', entities);
    DataApi.createEntityData(this.state.entitySetId, '', entities)
    .then((res) => {
      console.log('SUBMIT 200!');
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

  handleModalButtonClick = () => {
    window.location.reload();
  }

  render() {
    return (
      <div>
        <FormView
            handleInput={this.handleInput}
            handleDateInput={this.handleDateInput}
            handleTimeInput={this.handleTimeInput}
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
