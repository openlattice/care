import React from 'react';

import Promise from 'bluebird';
import { EntityDataModelApi, DataApi } from 'lattice';
import { Redirect, Route, Switch } from 'react-router-dom';

import FormView from '../components/FormView';
import ConfirmationModal from '../components/ConfirmationModalView';
import LogoutButton from './LogoutButton';

import * as RoutePaths from '../core/router/RoutePaths';

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
        dateReported: '',
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
    EntityDataModelApi.getEntitySetId('baltimoreHealthReport')
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
            this.setState({propertyTypes});
          });
        });
      });
    });
  }

  // For text input
  handleTextInput = (e) => {
    const sectionKey = e.target.dataset.section
    const name = e.target.name;
    const input = e.target.value;
    const sectionState = this.state[sectionKey];
    sectionState[name] = input;
    this.setState({ [sectionKey]: sectionState });
  }

  handleDateInput = (e, section, name) => {
    const input = e;
    const sectionState = this.state[section];
    sectionState[name] = input;
    this.setState({ [section]: sectionState });
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
    return res;
  }

  handleTimeInput = (e, section, name) => {
    const input = this.formatTime(e);
    const sectionState = this.state[section];
    sectionState[name] = input;
    this.setState({ [section]: sectionState });
  }

  // For radio or select input
  handleSingleSelection = (e) => {
    const sectionKey = e.target.dataset.section;
    const sectionState = this.state[sectionKey];
    sectionState[e.target.name] = e.target.value;
    this.setState({ [sectionKey]: sectionState });
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
    this.setState({ [sectionKey]: sectionState });
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
      formattedValue = (formattedValue.length > 0 && (formattedValue[0] === "" || formattedValue[0] === null)) ? [] : formattedValue;
      formattedValues[propertyType.id] = formattedValue;
    });

    const primaryKeys = this.state.entityType.key;
    const entityKey = primaryKeys.map((keyId) => {
      const utf8Val = (formattedValues[keyId].length > 0) ? encodeURI(formattedValues[keyId][0]) : '';
      return btoa(utf8Val);
    }).join(',');

    const entities = {
      [entityKey]: formattedValues
    };

    return entities;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const entities = this.getEntities();
    DataApi.createEntityData(this.state.entitySetId, '', entities)
    .then((res) => {
      this.setState({
        submitSuccess: true,
        submitFailure: false
      });
    })
    .catch((err) => {
      this.setState({
        submitSuccess: false,
        submitFailure: true
      });
    });
  }

  handleModalButtonClick = () => {
    window.location.reload();
  }

  renderForm = () => {

    return (
      <div>
        <LogoutButton />
        <FormView
            handleTextInput={this.handleTextInput}
            handleDateInput={this.handleDateInput}
            handleTimeInput={this.handleTimeInput}
            handleSingleSelection={this.handleSingleSelection}
            handleCheckboxChange={this.handleCheckboxChange}
            handleSubmit={this.handleSubmit}
            input={this.state} />
        {
          this.state.submitSuccess
            ? <ConfirmationModal
                  submitSuccess={this.state.submitSuccess}
                  submitFailure={this.state.submitFailure}
                  handleModalButtonClick={this.handleModalButtonClick} />
            : null
        }
      </div>
    );
  }

  render() {
    return (
      <Switch>
        <Route exact strict path={RoutePaths.ROOT} render={this.renderForm} />
        <Redirect to={RoutePaths.ROOT} />
      </Switch>
    );
  }
}

export default Form;
