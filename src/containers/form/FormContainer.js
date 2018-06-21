/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import isInteger from 'lodash/isInteger';
import parseInt from 'lodash/parseInt';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import type { Match, RouterHistory } from 'react-router';

import FormView from '../../components/FormView';
import ConfirmationModal from '../../components/ConfirmationModalView';

import { validateOnInput } from '../../shared/Validation';
import { formatTimePickerSeconds } from '../../utils/Utils';
import { loadApp, selectOrganization } from './AppActionFactory';
import { hardRestart, submitReport } from './ReportActionFactory';
import { SUBMISSION_STATES } from './ReportReducer';

import {
  APP_TYPES_FQNS,
  CONSUMER_STATE,
  FORM_PATHS,
  MAX_PAGE,
  PERSON
} from '../../shared/Consts';

import {
  getComplainantInfoInitialState,
  getConsumerInfoInitialState,
  getDispositionInfoInitialState,
  getOfficerInfoInitialState,
  getReportInfoInitialState
} from './DataModelDefinitions';

import type {
  ComplainantInfo,
  ConsumerInfo,
  DispositionInfo,
  OfficerInfo,
  ReportInfo
} from './DataModelDefinitions';

/*
 * types
 */

type Props = {
  actions :{
    hardRestart :() => void;
    submitReport :(args :Object) => void;
    loadApp :() => void;
    selectOrganization :(args :string) => void;
  };
  app :Map<*, *>;
  history :RouterHistory;
  match :Match;
  submissionState :number;
};

type State = {
  consumerInfo :ConsumerInfo;
  complainantInfo :ComplainantInfo;
  dispositionInfo :DispositionInfo;
  isConsumerSelected :boolean;
  officerInfo :OfficerInfo;
  reportInfo :ReportInfo;
};

class Form extends React.Component<Props, State> {

  constructor(props :Props) {

    super(props);

    // TODO: fix Flow errors
    this.state = {
      complainantInfo: getComplainantInfoInitialState(),
      consumerInfo: getConsumerInfoInitialState(),
      dispositionInfo: getDispositionInfoInitialState(),
      officerInfo: getOfficerInfoInitialState(),
      reportInfo: getReportInfoInitialState(),
      isConsumerSelected: false
    };
  }

  componentDidMount() {
    // this.props.actions.loadApp();
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

  handleDateInput = (e, section, name, formatErrors, setErrorsFn) => {
    let input = e || '';
    input = input.slice(0, 10);
    const sectionState = this.state[section];
    sectionState[name] = input;
    this.setState({ [section]: sectionState });
    validateOnInput(name, input, 'date', formatErrors, setErrorsFn);
  }

  handlePicture = (sectionKey, sectionPropertyName, value) => {
    const sectionState = this.state[sectionKey];
    sectionState[sectionPropertyName] = value;
    this.setState({ [sectionKey]: sectionState });
  }

  handleTimeInput = (e, section, name) => {
    const input = formatTimePickerSeconds(e);
    const sectionState = this.state[section];
    sectionState[name] = input;
    this.setState({ [section]: sectionState });
  }

  // For radio or select input
  handleSingleSelection = (e) => {
    const sectionKey = e.target.dataset.section;
    const sectionState = this.state[sectionKey];
    if (e.target.value === 'true') {
      sectionState[e.target.name] = true;
    }
    else if (e.target.value === 'false') {
      sectionState[e.target.name] = false;
    }
    else {
      sectionState[e.target.name] = e.target.value;
    }
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

  handleScaleSelection = (e) => {

    const sectionKey = e.target.dataset.section;
    const sectionState = this.state[sectionKey];

    const value = e.target.value;
    const valueAsInt = parseInt(value);
    if (isInteger(valueAsInt) && `${valueAsInt}` === value) {
      sectionState[e.target.name] = valueAsInt;
    }
    else {
      sectionState[e.target.name] = value;
    }

    this.setState({ [sectionKey]: sectionState });
  }

  handlePageChange = (path) => {
    this.props.history.push(path);
  }

  handlePersonSelection = (person) => {

    const consumerState = getConsumerInfoInitialState();
    if (person) {
      Object.keys(PERSON).forEach((key) => {
        const consumerKey = CONSUMER_STATE[key];
        const personKey = PERSON[key];
        if (person[personKey] && person[personKey].length > 0) {
          consumerState[consumerKey] = person[personKey][0];
        }
      });
    }
    this.setState({
      consumerInfo: consumerState,
      isConsumerSelected: !!person
    }, () => {
      this.handlePageChange(FORM_PATHS.CONSUMER);
    });
  }

  handleOrganizationSelection = (organizationId) => {
    this.props.actions.selectOrganization(organizationId);
  }

  handleSubmit = (event :SyntheticEvent<*>) => {

    event.preventDefault();

    this.props.actions.submitReport({
      complainantInfo: this.state.complainantInfo,
      consumerInfo: this.state.consumerInfo,
      dispositionInfo: this.state.dispositionInfo,
      officerInfo: this.state.officerInfo,
      reportInfo: this.state.reportInfo,
      app: this.props.app
    });
  }

  isInReview = () => {
    const slashIndex :number = window.location.hash.lastIndexOf('/');
    const page = window.location.hash.substring(slashIndex + 1);
    return Number.parseInt(page, 10) === MAX_PAGE;
  }

  renderModal = () => {

    const { submissionState } = this.props;
    const { PRE_SUBMIT, IS_SUBMITTING } = SUBMISSION_STATES;

    if (submissionState === PRE_SUBMIT || submissionState === IS_SUBMITTING) {
      return null;
    }

    return (
      <ConfirmationModal
          submissionState={this.props.submissionState}
          handleModalButtonClick={this.props.actions.hardRestart} />
    );
  }

  render() {

    const { PEOPLE_FQN } = APP_TYPES_FQNS;
    const selectedOrganizationId :string = this.props.app.get('selectedOrganization');
    const peopleEntitySetId :string = this.props.app.getIn([
      PEOPLE_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);
    const organizations = this.props.app.get('organizations');

    return (
      <FormView
          handlePicture={this.handlePicture}
          handleTextInput={this.handleTextInput}
          handleDateInput={this.handleDateInput}
          handleTimeInput={this.handleTimeInput}
          handleSingleSelection={this.handleSingleSelection}
          handleCheckboxChange={this.handleCheckboxChange}
          handleScaleSelection={this.handleScaleSelection}
          handleSubmit={this.handleSubmit}
          reportInfo={this.state.reportInfo}
          consumerInfo={this.state.consumerInfo}
          complainantInfo={this.state.complainantInfo}
          dispositionInfo={this.state.dispositionInfo}
          officerInfo={this.state.officerInfo}
          handlePageChange={this.handlePageChange}
          handlePersonSelection={this.handlePersonSelection}
          personEntitySetId={peopleEntitySetId}
          isInReview={this.isInReview}
          consumerIsSelected={this.state.isConsumerSelected}
          renderModal={this.renderModal}
          organizations={organizations}
          selectedOrganizationId={selectedOrganizationId}
          handleOrganizationSelection={this.handleOrganizationSelection} />
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    app: state.get('app', Immutable.Map()),
    submissionState: state.getIn(['report', 'submissionState'])
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    hardRestart,
    submitReport,
    loadApp,
    selectOrganization: (organizationId) => {
      const action = selectOrganization(organizationId);
      return selectOrganization.request(action.id, action.value);
    }
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Form)
);
