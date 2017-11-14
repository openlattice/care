/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import Promise from 'bluebird';
import { EntityDataModelApi, DataApi, SearchApi, SyncApi } from 'lattice';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import FormView from '../../components/FormView';
import ConfirmationModal from '../../components/ConfirmationModalView';
import { ENTITY_SET_NAMES, PERSON, CONSUMER_STATE, STRING_ID_FQN } from '../../shared/Consts';
import { validateOnInput } from '../../shared/Validation';

import { loadDataModel } from './EntitySetsActionFactory';

import {
  COMPLAINANT_INFO_INITIAL_STATE,
  CONSUMER_INFO_INITIAL_STATE,
  REPORT_INFO_INITIAL_STATE,
  DISPOSITION_INFO_INITIAL_STATE,
  OFFICER_INFO_INITIAL_STATE
} from './DataModelDefinitions';

import type {
  ComplainantInfo,
  ConsumerInfo,
  DispositionInfo,
  OfficerInfo,
  ReportInfo
} from './DataModelDefinitions';

/*
 * constants
 */

const MAX_PAGE :number = 7;

/*
 * types
 */

type Props = {
  actions :{
    loadDataModel :() => void
  },
  entitySets :Map<*, *>,
  isConsumerSelected :boolean
};

type State = {
  consumerInfo :ConsumerInfo,
  complainantInfo :ComplainantInfo,
  dispositionInfo :DispositionInfo,
  officerInfo :OfficerInfo,
  reportInfo :ReportInfo
};

class Form extends React.Component<Props, State> {

  constructor(props) {

    super(props);

    this.state = {
      complainantInfo: COMPLAINANT_INFO_INITIAL_STATE,
      consumerInfo: CONSUMER_INFO_INITIAL_STATE,
      reportInfo: REPORT_INFO_INITIAL_STATE,
      dispositionInfo: DISPOSITION_INFO_INITIAL_STATE,
      officerInfo: OFFICER_INFO_INITIAL_STATE,
      isConsumerSelected: false
    };
  }

  componentDidMount() {

    this.props.actions.loadDataModel();
  }

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
      ss = ss - 60;
    }

    while (mm >= 60) {
      hh += 1;
      mm = mm - 60;
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
    const page = parseInt(window.location.hash.substr(2, 10));
    if (page && page === this.state.maxPage) return true;
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
            maxPage={this.state.maxPage}
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

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    entitySets: state.get('entitySets', Immutable.Map())
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    loadDataModel
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));
