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
import { validateOnInput } from '../../shared/Validation';
import { fixDatePickerIsoDateTime, formatTimePickerSeconds, getCurrentPage } from '../../utils/Utils';
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

  handleDatePickerDateTimeOffset = (value, section, name) => {

    const sectionState = this.state[section];
    sectionState[name] = fixDatePickerIsoDateTime(value);
    this.setState({ [section]: sectionState });
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

  handleMultiUpdate = (sectionKey, values) => {

    const sectionState = this.state[sectionKey];
    Object.keys(values).forEach((key) => {
      sectionState[key] = values[key];
    });
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

  isInReview = () => (
    getCurrentPage() === MAX_PAGE
  )

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
          complainantInfo={this.state.complainantInfo}
          consumerInfo={this.state.consumerInfo}
          consumerIsSelected={this.state.isConsumerSelected}
          dispositionInfo={this.state.dispositionInfo}
          isInReview={this.isInReview}
          handleCheckboxChange={this.handleCheckboxChange}
          handleDateInput={this.handleDateInput}
          handleDatePickerDateTimeOffset={this.handleDatePickerDateTimeOffset}
          handleMultiUpdate={this.handleMultiUpdate}
          handleOrganizationSelection={this.handleOrganizationSelection}
          handlePageChange={this.handlePageChange}
          handlePersonSelection={this.handlePersonSelection}
          handlePicture={this.handlePicture}
          handleScaleSelection={this.handleScaleSelection}
          handleSingleSelection={this.handleSingleSelection}
          handleSubmit={this.handleSubmit}
          handleTextInput={this.handleTextInput}
          handleTimeInput={this.handleTimeInput}
          officerInfo={this.state.officerInfo}
          organizations={organizations}
          personEntitySetId={peopleEntitySetId}
          reportInfo={this.state.reportInfo}
          selectedOrganizationId={selectedOrganizationId}
          submissionState={this.props.submissionState} />
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
