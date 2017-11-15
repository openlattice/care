import React from 'react';

import Promise from 'bluebird';
import { EntityDataModelApi, DataApi, SearchApi, SyncApi } from 'lattice';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import FormView from '../../components/FormView';
import ConfirmationModal from '../../components/ConfirmationModalView';
import {
  ENTITY_SET_NAMES,
  PERSON,
  CONSUMER_STATE,
  STRING_ID_FQN,
  MAX_PAGE
} from '../../shared/Consts';
import { validateOnInput } from '../../shared/Validation';


class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reportInfo: {
        dispatchReason: '',
        complaintNumber: '',
        companionOffenseReport: false,
        incident: '',
        locationOfIncident: '',
        unit: '',
        postOfOccurrence: '',
        cadNumber: '',
        onView: false,
        dateOccurred: '',
        timeOccurred: '',
        dateReported: '',
        timeReported: '',
        name: ''
      },
      consumerInfo: {
        firstName: '',
        lastName: '',
        middleName: '',
        address: '',
        phone: '',
        identification: '',
        militaryStatus: '',
        gender: '',
        race: '',
        age: '',
        dob: '',
        homeless: false,
        homelessLocation: '',
        drugsAlcohol: '',
        drugType: '',
        prescribedMedication: '',
        takingMedication: '',
        prevPsychAdmission: '',
        selfDiagnosis: [],
        selfDiagnosisOther: '',
        armedWithWeapon: false,
        armedWeaponType: '',
        accessToWeapons: false,
        accessibleWeaponType: '',
        observedBehaviors: [],
        observedBehaviorsOther: '',
        emotionalState: [],
        emotionalStateOther: '',
        photosTakenOf: [],
        injuries: [],
        injuriesOther: '',
        suicidal: false,
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
        hospitalTransport: false,
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
      personEntitySetId: '',
      appearsInEntitySetId: '',
      entitySet: {},
      personEntitySet: {},
      appearsInEntitySet: {},
      entityType: {},
      personEntityType: {},
      appearsInEntityType: {},
      propertyTypes: [],
      personPropertyTypes: [],
      appearsInPropertyTypes: [],
      submitSuccess: null,
      submitFailure: null,
      consumerIsSelected: false
    };
  }

  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired
  }

  componentDidMount() {
    EntityDataModelApi.getEntitySetId(ENTITY_SET_NAMES.FORM)
      .then((id) => {
        this.setState({ entitySetId: id });
        EntityDataModelApi.getEntitySet(id)
          .then((entitySet) => {
            this.setState({ entitySet });
            EntityDataModelApi.getEntityType(entitySet.entityTypeId)
              .then((entityType) => {
                this.setState({ entityType });
                Promise.map(entityType.properties, (propertyId) => {
                  return EntityDataModelApi.getPropertyType(propertyId);
                })
                  .then((propertyTypes) => {
                    this.setState({ propertyTypes });
                    this.getPersonEntitySet();
                  });
              });
          });
      });
  }

  getPersonEntitySet = () => {
    const start = 0;
    const maxHits = 50;
    const searchTerm = '*';
    const searchOptions = {
      start,
      maxHits,
      searchTerm
    };
    EntityDataModelApi.getEntitySetId(ENTITY_SET_NAMES.PEOPLE)
      .then((personEntitySetId) => {
        SearchApi.searchEntitySetData(personEntitySetId, searchOptions);
        this.setState({ personEntitySetId });
        EntityDataModelApi.getEntitySet(personEntitySetId)
          .then((personEntitySet) => {
            this.setState({ personEntitySet });
            EntityDataModelApi.getEntityType(personEntitySet.entityTypeId)
              .then((personEntityType) => {
                this.setState({ personEntityType });
                Promise.map(personEntityType.properties, (propertyId) => {
                  return EntityDataModelApi.getPropertyType(propertyId);
                })
                  .then((personPropertyTypes) => {
                    this.setState({ personPropertyTypes });
                    this.getAppearsInEntitySet();
                  });
              });
          });
      });
  }

  getAppearsInEntitySet = () => {
    EntityDataModelApi.getEntitySetId(ENTITY_SET_NAMES.APPEARS_IN)
      .then((appearsInEntitySetId) => {
        this.setState({ appearsInEntitySetId });
        EntityDataModelApi.getEntitySet(appearsInEntitySetId)
          .then((appearsInEntitySet) => {
            this.setState({ appearsInEntitySet });
            EntityDataModelApi.getEntityType(appearsInEntitySet.entityTypeId)
              .then((appearsInEntityType) => {
                this.setState({ appearsInEntityType });
                Promise.map(appearsInEntityType.properties, (propertyId) => {
                  return EntityDataModelApi.getPropertyType(propertyId);
                })
                  .then((appearsInPropertyTypes) => {
                    this.setState({ appearsInPropertyTypes });
                  });
              });
          });
      });
  }

  // For text input
  handleTextInput = (e, fieldType, formatErrors, setErrorsFn) => {
    const sectionKey = e.target.dataset.section;
    const name = e.target.name;
    const input = e.target.value;
    const sectionState = this.state[sectionKey];
    sectionState[name] = input;
    this.setState({ [sectionKey]: sectionState });
    validateOnInput(name, input, fieldType, formatErrors, setErrorsFn);
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
      mm += 1;
      ss -= 60;
    }

    while (mm >= 60) {
      hh += 1;
      mm -= 60;
    }

    let hhStr = hh.toString();
    hhStr = hhStr.length === 1 ? `0${hhStr}` : hhStr;

    let mmStr = mm.toString();
    mmStr = mmStr.length === 1 ? `0${mmStr}` : mmStr;

    let ssStr = ss.toString();
    ssStr = ssStr.length === 1 ? `0${ssStr}` : ssStr;

    const res = `${hhStr}:${mmStr}:${ssStr}`;
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

  handlePageChange = (path) => {
    this.props.history.push(path);
  }

  handlePersonSelection = (person) => {
    const consumerState = Object.assign({}, this.state.consumerInfo);
    Object.keys(PERSON).forEach((key) => {
      const consumerKey = CONSUMER_STATE[key];
      const personKey = PERSON[key];
      const personVal = person[personKey][0];
      consumerState[consumerKey] = personVal;
    });
    this.setState({
      consumerInfo: consumerState,
      consumerIsSelected: true
    }, () => {
      this.handlePageChange('next');
    });
  }

  getAppearsInEntity = (syncId) => {
    const entityId = btoa(this.state.consumerInfo.identification);
    const key = {
      entitySetId: this.state.appearsInEntitySetId,
      entityId,
      syncId
    };

    const stringIdPropId = this.state.appearsInPropertyTypes.filter((propertyType) => {
      const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
      return (fqn === STRING_ID_FQN);
    })[0].id;

    const details = {
      [stringIdPropId]: [this.state.consumerInfo.identification]
    };

    return { key, details };
  }

  getPersonEntity = (syncId) => {
    const { identification, firstName, lastName, middleName, dob, gender, race, age } = this.state.consumerInfo;
    const entityId = btoa(identification);
    const key = {
      entitySetId: this.state.personEntitySetId,
      entityId,
      syncId
    };

    const props = {};
    this.state.personPropertyTypes.forEach((propertyType) => {
      const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
      props[fqn] = propertyType.id;
    });

    const details = {};
    details[props[PERSON.ID_FQN]] = [identification];
    details[props[PERSON.LAST_NAME_FQN]] = (lastName && lastName.length) ? [lastName] : [];
    details[props[PERSON.FIRST_NAME_FQN]] = (firstName && firstName.length) ? [firstName] : [];
    details[props[PERSON.MIDDLE_NAME_FQN]] = (middleName && middleName.length) ? [middleName] : [];
    details[props[PERSON.DOB_FQN]] = (dob && dob.length) ? [dob] : [];
    details[props[PERSON.SEX_FQN]] = (gender && gender.length) ? [gender] : [];
    details[props[PERSON.RACE_FQN]] = (race && race.length) ? [race] : [];
    details[props[PERSON.AGE_FQN]] = (age && age.length) ? [age] : [];

    return { key, details };
  }

  getFormEntity = (syncId) => {
    const formInputs = Object.assign(
      {},
      this.state.reportInfo,
      this.state.consumerInfo,
      this.state.complainantInfo,
      this.state.dispositionInfo,
      this.state.officerInfo
    );

    const details = {};
    this.state.propertyTypes.forEach((propertyType) => {
      const value = formInputs[propertyType.type.name];

      let formattedValue;
      formattedValue = Array.isArray(value) ? value : [value];
      if (formattedValue.length > 0
        && (formattedValue[0] === '' || formattedValue[0] === null)
      ) {
        formattedValue = [];
      }

      details[propertyType.id] = formattedValue;
    });

    const primaryKeys = this.state.entityType.key;
    const entityId = primaryKeys.map((keyId) => {
      const val = (details[keyId] && details[keyId][0]) ? details[keyId][0] : '';
      const utf8Val = (details[keyId].length > 0) ? encodeURI(val) : '';
      return btoa(utf8Val);
    }).join(',');

    const key = {
      entitySetId: this.state.entitySetId,
      entityId,
      syncId
    };

    return { key, details };
  }

  getBulkData = () => {
    const { entitySetId, personEntitySetId, appearsInEntitySetId } = this.state;
    return SyncApi.getCurrentSyncId(entitySetId)
      .then((formSyncId) => {
        const formEntity = this.getFormEntity(formSyncId);
        return SyncApi.getCurrentSyncId(personEntitySetId)
          .then((personSyncId) => {
            const personEntity = this.getPersonEntity(personSyncId);
            return SyncApi.getCurrentSyncId(appearsInEntitySetId)
              .then((appearsInSyncId) => {
                const appearsInEntity = this.getAppearsInEntity(appearsInSyncId);
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
      DataApi.createEntityAndAssociationData(bulkData)
        .then(() => {
          this.setState({
            submitSuccess: true,
            submitFailure: false
          });
        })
        .catch(() => {
          this.setState({
            submitSuccess: false,
            submitFailure: true
          });
        });
    });
  }

  handleModalButtonClick = () => {
    window.location.reload();
  }

  isInReview = () => {
    const page = parseInt(window.location.hash.substr(2), 10);
    if (page && page === MAX_PAGE) return true;
    return false;
  }

  render() {

    return (
      <div>
        <FormView
            handleTextInput={this.handleTextInput}
            handleDateInput={this.handleDateInput}
            handleTimeInput={this.handleTimeInput}
            handleSingleSelection={this.handleSingleSelection}
            handleCheckboxChange={this.handleCheckboxChange}
            handleSubmit={this.handleSubmit}
            reportInfo={this.state.reportInfo}
            consumerInfo={this.state.consumerInfo}
            complainantInfo={this.state.complainantInfo}
            dispositionInfo={this.state.dispositionInfo}
            officerInfo={this.state.officerInfo}
            handlePageChange={this.handlePageChange}
            handlePersonSelection={this.handlePersonSelection}
            personEntitySetId={this.state.personEntitySetId}
            isInReview={this.isInReview}
            consumerIsSelected={this.state.consumerIsSelected} />
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

export default withRouter(Form);
