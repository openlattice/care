/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import Promise from 'bluebird';
import { Models, DataApi, SyncApi } from 'lattice';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import type { Match, RouterHistory } from 'react-router';

import FormView from '../../components/FormView';
import ConfirmationModal from '../../components/ConfirmationModalView';
import { validateOnInput } from '../../shared/Validation';
import { formatTimePickerSeconds } from '../../utils/Utils';
import { loadDataModel } from './EntitySetsActionFactory';
import { submitReport } from './ReportActionFactory';

import {
  CONSUMER_STATE,
  ENTITY_SET_NAMES,
  MAX_PAGE,
  PERSON,
  STRING_ID_FQN
} from '../../shared/Consts';

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

const { FullyQualifiedName } = Models;

/*
 * types
 */

type Props = {
  actions :{
    loadDataModel :() => void,
    submitReport :(args :Object) => void
  };
  entitySets :Map<*, *>;
  isSubmittingReport :boolean;
  history :RouterHistory;
  match :Match;
  submissionSuccess :boolean;
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
      isConsumerSelected: true
    }, () => {
      this.handlePageChange('next');
    });
  }

  handleSubmit = () => {

    this.props.actions.submitReport({
      complainantInfo: this.state.complainantInfo,
      consumerInfo: this.state.consumerInfo,
      dispositionInfo: this.state.dispositionInfo,
      entitySets: this.props.entitySets,
      officerInfo: this.state.officerInfo,
      reportInfo: this.state.reportInfo
    });
  }

  handleModalButtonClick = () => {
    window.location.reload();
  }

  isInReview = () => {
    const page :number = parseInt(this.props.match.params.page, 10);
    return page === MAX_PAGE;
  }

  render() {

    const { PEOPLE } = ENTITY_SET_NAMES;
    const peopleEntitySetId :string = this.props.entitySets.getIn([PEOPLE, 'entitySet', 'id'], '');

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
            personEntitySetId={peopleEntitySetId}
            isInReview={this.isInReview}
            consumerIsSelected={this.state.isConsumerSelected} />
        {
          this.state.submitSuccess
            ? <ConfirmationModal
                submissionSuccess={this.props.submissionSuccess}
                handleModalButtonClick={this.handleModalButtonClick} />
            : null
        }
      </div>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    entitySets: state.get('entitySets', Immutable.Map()),
    isSubmittingReport: state.getIn(['report', 'isSubmittingReport'], false),
    submissionSuccess: state.getIn(['report', 'submissionSuccess'], false)
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    loadDataModel,
    submitReport
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Form)
);
