import React from 'react';
import Promise from 'bluebird';
import { AppApi, EntityDataModelApi, DataApi, SyncApi } from 'lattice';

import FormView from '../../components/FormView';
import ConfirmationModal from '../../components/ConfirmationModalView';
import LogoutButton from '../app/LogoutButton';
import OrganizationButton from '../app/OrganizationButton';

import * as RoutePaths from '../../core/router/RoutePaths';

const APP_NAME = 'bhr';

const FORM_CONFIG_TYPE = 'app.bhr';
const PERSON_CONFIG_TYPE = 'app.people';
const APPEARS_IN_CONFIG_TYPE = 'app.appearsin';


const ID_FQN = 'nc.SubjectIdentification';
const FIRST_NAME_FQN = 'nc.PersonGivenName';
const LAST_NAME_FQN = 'nc.PersonSurName';
const MIDDLE_NAME_FQN = 'nc.PersonMiddleName';
const SEX_FQN = 'nc.PersonSex';
const RACE_FQN = 'nc.PersonRace';
const DOB_FQN = 'nc.PersonBirthDate';

const STRING_ID_FQN = 'general.stringid';

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
        firstName: '',
        lastName: '',
        middleName: '',
        address: '',
        phone: '',
        identification: '',
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
      bhrPropertyTypes: [],
      personPropertyTypes: [],
      appearsInPropertyTypes: [],
      submitSuccess: null,
      submitFailure: null,
      configurations: {},
      selectedOrganizationId: ''
    };
  }

  componentDidMount() {
    this.getApp();
  }

  getConfigurations = (appId) => {
    AppApi.getConfigurations(appId).then((configurations) => {
      const defaultConfig = configurations[0];
      const selectedOrganizationId = (configurations.length) ? defaultConfig.organization.id : '';
      this.setState({ configurations, selectedOrganizationId });
    });
  }

  getApp = () => {
    AppApi.getAppByName(APP_NAME).then((app) => {
      this.getConfigurations(app.id);
      AppApi.getAppTypeIds(app.appTypeIds).then((appTypes) => {
        Object.values(appTypes).forEach((appType) => {
          const { type, entityTypeId } = appType;
          const appTypeFqn = `${type.namespace}.${type.name}`;
          this.getPropertyTypes(entityTypeId).then((propertyTypes) => {
            switch (appTypeFqn) {
              case FORM_CONFIG_TYPE:
                this.setState({ bhrPropertyTypes: propertyTypes });
                break;
              case PERSON_CONFIG_TYPE:
                this.setState({ personPropertyTypes: propertyTypes });
                break;
              case APPEARS_IN_CONFIG_TYPE:
                this.setState({ appearsInPropertyTypes: propertyTypes });
                break;
              default:
                console.error(`Unexpected app type: ${appTypeFqn}`);
                break;
            }
          });
        });
      });
    });
  }

  getPropertyTypes = (entityTypeId) => {
    return EntityDataModelApi.getEntityType(entityTypeId)
      .then((entityType) => {
        this.setState({ entityType });
        return Promise.map(entityType.properties, (propertyId) => {
          return EntityDataModelApi.getPropertyType(propertyId);
        }).then((propertyTypes) => {
          return propertyTypes;
        });
      });
  }

  // For text input
  handleTextInput = (e) => {
    const sectionKey = e.target.dataset.section;
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
    }
    else {
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
    this.state.bhrPropertyTypes.forEach((propertyType) => {
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

  getAppearsInEntity = (entitySetId, syncId) => {
    const entityId = btoa(this.state.consumerInfo.identification);
    const key = { entitySetId, entityId, syncId };

    const stringIdPropId = this.state.appearsInPropertyTypes.filter((propertyType) => {
      const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
      return (fqn === STRING_ID_FQN);
    })[0].id;

    const details = {
      [stringIdPropId]: [this.state.consumerInfo.identification]
    };

    return { key, details };
  }

  getPersonEntity = (entitySetId, syncId) => {
    const { identification, firstName, lastName, middleName, dob, gender, race } = this.state.consumerInfo;
    const entityId = btoa(identification);
    const key = { entitySetId, entityId, syncId };

    const props = {};
    this.state.personPropertyTypes.forEach((propertyType) => {
      const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
      props[fqn] = propertyType.id;
    });

    const details = {};
    details[props[ID_FQN]] = [identification];
    details[props[LAST_NAME_FQN]] = (lastName && lastName.length) ? [lastName] : [];
    details[props[FIRST_NAME_FQN]] = (firstName && firstName.length) ? [firstName] : [];
    details[props[MIDDLE_NAME_FQN]] = (middleName && middleName.length) ? [middleName] : [];
    details[props[DOB_FQN]] = (dob && dob.length) ? [dob] : [];
    details[props[SEX_FQN]] = (gender && gender.length) ? [gender] : [];
    details[props[RACE_FQN]] = (race && race.length) ? [race] : [];

    return { key, details };
  }

  getFormEntity = (entitySetId, syncId) => {
    const formInputs = Object.assign(
      {},
      this.state.reportInfo,
      this.state.consumerInfo,
      this.state.complainantInfo,
      this.state.dispositionInfo,
      this.state.officerInfo
    );

    const details = {};
    this.state.bhrPropertyTypes.forEach((propertyType) => {
      const value = formInputs[propertyType.type.name];
      let formattedValue;
      if (value !== null && value !== undefined) {
        formattedValue = Array.isArray(value) ? value : [value];
        formattedValue = (formattedValue.length > 0 && (formattedValue[0] === '' || formattedValue[0] === null))
          ? [] : formattedValue;
        details[propertyType.id] = formattedValue;
      }
    });

    const primaryKeys = this.state.entityType.key;
    const entityId = primaryKeys.map((keyId) => {
      const val = (details[keyId] && details[keyId][0]) ? details[keyId][0] : '';
      const utf8Val = (details[keyId].length > 0) ? encodeURI(val) : '';
      return btoa(utf8Val);
    }).join(',');

    const key = { entitySetId, entityId, syncId };

    return { key, details };
  }

  getBulkData = () => {
    const { configurations, selectedOrganizationId } = this.state;
    if (!configurations.length || !selectedOrganizationId.length) return {};
    const selectedConfiguration = configurations.filter((configuration) => {
      return selectedOrganizationId === configuration.organization.id;
    })[0].config;

    const entitySetId = selectedConfiguration[FORM_CONFIG_TYPE];
    const personEntitySetId = selectedConfiguration[PERSON_CONFIG_TYPE];
    const appearsInEntitySetId = selectedConfiguration[APPEARS_IN_CONFIG_TYPE];

    return SyncApi.getCurrentSyncId(entitySetId)
      .then((formSyncId) => {
        const formEntity = this.getFormEntity(entitySetId, formSyncId);
        return SyncApi.getCurrentSyncId(personEntitySetId)
          .then((personSyncId) => {
            const personEntity = this.getPersonEntity(personEntitySetId, personSyncId);
            return SyncApi.getCurrentSyncId(appearsInEntitySetId)
              .then((appearsInSyncId) => {
                const appearsInEntity = this.getAppearsInEntity(appearsInEntitySetId, appearsInSyncId);
                appearsInEntity.src = personEntity.key;
                appearsInEntity.dst = formEntity.key;

                const entities = [formEntity, personEntity];
                const associations = [appearsInEntity];

                const esIdsAndSyncIds = [
                  [entitySetId, formSyncId],
                  [personEntitySetId, personSyncId],
                  [appearsInEntitySetId, appearsInSyncId]
                ];

                return Promise.map(esIdsAndSyncIds, (pair) => {
                  return DataApi.acquireSyncTicket(pair[0], pair[1]);
                }).then((syncTickets) => {
                  return { syncTickets, entities, associations };
                });
              });
          });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.getBulkData().then((bulkData) => {
      DataApi.createEntityAndAssociationData(bulkData);
    });
  }

  handleModalButtonClick = () => {
    window.location.reload();
  }

  renderOrganizationButton = () => {
    const { configurations, selectedOrganizationId } = this.state;
    if (!configurations.length || !selectedOrganizationId.length) return null;
    const organizations = configurations.map((configuration) => {
      return configuration.organization;
    });
    return (
      <OrganizationButton
          organizations={organizations}
          selectedOrganization={selectedOrganizationId}
          selectOrganization={(id) => {
            this.setState({ selectedOrganizationId: id });
          }} />
    );
  }

  render() {

    return (
      <div>
        {this.renderOrganizationButton()}
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
}

export default Form;
