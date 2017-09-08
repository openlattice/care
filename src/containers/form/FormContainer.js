/*
 * @flow
 */

import React from 'react';
import {withRouter} from "react-router-dom";
import Promise from 'bluebird';
import { EntityDataModelApi, DataApi } from 'lattice';

import FormView from '../../components/FormView';
import ConfirmationModal from '../../components/ConfirmationModalView';
import LogoutButton from '../app/LogoutButton';
import * as RoutePaths from '../../core/router/RoutePaths';
import {Page} from '../shared/Layout';
import { ENTITY_SET_NAMES, PERSON, CONSUMER_STATE, STRING_ID_FQN } from '../shared/Consts';

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
        street: '',
        city: '',
        state: '',
        county: '',
        zip: '',
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
        complainantLastName: '',
        complainantFirstName: '',
        complainantMiddleName: '',
        complainantStreet: '',
        complainantCity: '',
        complainantState: '',
        complainantZip: '',
        complainantCounty: '',
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
        officerLastName: '',
        officerFirstName: '',

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
      page: 1,
      maxPage: 6,
      consumerIsSelected: false
    };
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

      const start = 0;
      const maxHits = 50;
      const searchTerm = '*';
      const searchOptions = {
        start,
        maxHits,
        searchTerm
      };
      SearchApi.searchEntitySetData("5e004de9-ac2a-47f0-96a4-cfe060e1f916", searchOptions)
        .then((res) => {
          console.log('search res:', res);
        });
  }

  getPersonEntitySet = () => {
    EntityDataModelApi.getEntitySetId(ENTITY_SET_NAMES.PEOPLE)
      .then((personEntitySetId) => {
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

  handlePageChange = (direction) => {
    let currentPage = window.location.hash.substr(2);
    if (direction === 'prev') {
      this.props.history.push(`/${-currentPage}`);
    } else if (direction === 'next') {
      console.log('current, next page:', currentPage, ++currentPage);
      this.props.history.push(`/${+currentPage}`);
    }
  }

  handlePersonSelection = (person) => {
    let consumerState = Object.assign({}, this.state.consumerInfo);
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
    const { identification, firstName, lastName, middleName, dob, gender, race } = this.state.consumerInfo;
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
      formattedValue = (formattedValue.length > 0 && (formattedValue[0] === '' || formattedValue[0] === null))
        ? [] : formattedValue;
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
    console.log('entity set id:', entitySetId);
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
      console.log('bulk data:', bulkData);
      DataApi.createEntityAndAssociationData(bulkData).then(() => {
        console.log('success!');
        this.setState({ 
          submitSuccess: true,
          submitFailure: false
        });
      })
      .catch((err) => {
        console.log('err: ', err);
        this.setState({
          submitSuccess: false,
          submitFailure: true
        });
      })
    });
  }

  handleModalButtonClick = () => {
    window.location.reload();
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
            input={this.state}
            page={this.state.page}
            maxPage={this.state.maxPage}
            handlePageChange={this.handlePageChange}
            handlePersonSelection={this.handlePersonSelection}
            personEntitySetId={this.state.personEntitySetId} />
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
