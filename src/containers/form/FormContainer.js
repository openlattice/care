/*
 * @flow
 */

import React from 'react';

import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import type { RouterHistory } from 'react-router';

import FormView from '../../components/FormView';
import { hardRestart, submitReport } from './ReportActionFactory';
import { APP_TYPES_FQNS, FORM_PATHS } from '../../shared/Consts';

import {
  getComplainantInfoInitialState,
  getConsumerInfoInitialState,
  getDispositionInfoInitialState,
  getOfficerInfoInitialState,
  getReportInfoInitialState
} from './DataModelDefinitions';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

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
  consumerInfo :Object;
  complainantInfo :Object;
  dispositionInfo :Object;
  isConsumerSelected :boolean;
  officerInfo :Object;
  reportInfo :Object;
};

class Form extends React.Component<Props, State> {

  constructor(props :Props) {

    super(props);

    // TODO: these don't need to be separated anymore
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

  handlePageChange = (path) => {
    const { history } = this.props;
    history.push(path);
  }

  handlePersonSelection = (person) => {

    const consumerState = getConsumerInfoInitialState(person);
    this.setState({
      consumerInfo: consumerState,
      isConsumerSelected: !!person
    }, () => {
      this.handlePageChange(FORM_PATHS.CONSUMER);
    });
  }

  handleSubmit = (event :SyntheticEvent<*>) => {

    event.preventDefault();

    const { actions, app } = this.props;
    const {
      complainantInfo,
      consumerInfo,
      dispositionInfo,
      officerInfo,
      reportInfo,
    } = this.state;

    actions.submitReport({
      app,
      complainantInfo,
      consumerInfo,
      dispositionInfo,
      officerInfo,
      reportInfo,
    });
  }

  render() {

    const { app, submissionState } = this.props;
    const {
      complainantInfo,
      consumerInfo,
      dispositionInfo,
      isConsumerSelected,
      officerInfo,
      reportInfo,
    } = this.state;

    const selectedOrganizationId :string = app.get('selectedOrganizationId');
    const peopleEntitySetId :string = app.getIn([
      PEOPLE_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);
    const organizations = app.get('organizations');

    return (
      <FormView
          complainantInfo={complainantInfo}
          consumerInfo={consumerInfo}
          consumerIsSelected={isConsumerSelected}
          dispositionInfo={dispositionInfo}
          handlePageChange={this.handlePageChange}
          handlePersonSelection={this.handlePersonSelection}
          handlePicture={this.handlePicture}
          handleSubmit={this.handleSubmit}
          officerInfo={officerInfo}
          organizations={organizations}
          personEntitySetId={peopleEntitySetId}
          reportInfo={reportInfo}
          selectedOrganizationId={selectedOrganizationId}
          submissionState={submissionState}
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
