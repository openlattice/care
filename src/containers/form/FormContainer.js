/*
 * @flow
 */

import React from 'react';

import isInteger from 'lodash/isInteger';
import moment from 'moment';
import parseInt from 'lodash/parseInt';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import type { RouterHistory } from 'react-router';

import FormView from '../../components/FormView';
import { validateOnInput } from '../../shared/Validation';
import { hardRestart, submitReport } from './ReportActionFactory';

import {
  APP_TYPES_FQNS,
  CONSUMER_STATE,
  FORM_PATHS,
  PERSON,
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
  };
  app :Map<*, *>;
  history :RouterHistory;
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

  updateStateValue = (section, key, value) => {

    // TODO: validation
    const { [section]: sectionState } = this.state;
    sectionState[key] = value;
    this.setState({ [section]: sectionState });
  }

  updateStateValues = (section, values) => {

    // TODO: validation
    const { [section]: sectionState } = this.state;
    Object.keys(values).forEach((key) => {
      sectionState[key] = values[key];
    });
    this.setState({ [section]: sectionState });
  }

  handlePicture = (sectionKey, sectionPropertyName, value) => {
    const sectionState = this.state[sectionKey];
    sectionState[sectionPropertyName] = value;
    this.setState({ [sectionKey]: sectionState });
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
    const { history } = this.props;
    history.push(path);
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
      const dob = person[PERSON.DOB_FQN];
      if (dob && dob.length > 0) {
        if (moment(dob[0]).isValid()) {
          consumerState[CONSUMER_STATE.AGE] = `${moment().diff(moment(dob[0]), 'years')}`;
        }
      }
    }
    this.setState({
      consumerInfo: consumerState,
      isConsumerSelected: !!person
    }, () => {
      this.handlePageChange(FORM_PATHS.CONSUMER);
    });
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

  render() {

    const { PEOPLE_FQN } = APP_TYPES_FQNS;
    const selectedOrganizationId :string = this.props.app.get('selectedOrganizationId');
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
          handleCheckboxChange={this.handleCheckboxChange}
          handlePageChange={this.handlePageChange}
          handlePersonSelection={this.handlePersonSelection}
          handlePicture={this.handlePicture}
          handleScaleSelection={this.handleScaleSelection}
          handleSingleSelection={this.handleSingleSelection}
          handleSubmit={this.handleSubmit}
          officerInfo={this.state.officerInfo}
          organizations={organizations}
          personEntitySetId={peopleEntitySetId}
          reportInfo={this.state.reportInfo}
          selectedOrganizationId={selectedOrganizationId}
          submissionState={this.props.submissionState}
          updateStateValue={this.updateStateValue}
          updateStateValues={this.updateStateValues} />
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    app: state.get('app', Map()),
    submissionState: state.getIn(['report', 'submissionState'])
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    hardRestart,
    submitReport,
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Form)
);
