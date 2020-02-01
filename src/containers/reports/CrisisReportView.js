/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { AuthUtils } from 'lattice-auth';
import { Button, Spinner } from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Match, RouterHistory } from 'react-router';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import ReviewContainer from './ReviewContainer';
import {
  clearReport,
  deleteReport,
  getReport,
  updateReport
} from './ReportsActions';

import DeleteModal from '../../components/modals/DeleteModal';
import DiscardModal from '../../components/modals/DiscardModal';
import Disposition from '../pages/disposition/Disposition';
import FormRecord from '../../components/form/FormRecord';
import NatureOfCrisis from '../pages/natureofcrisis/NatureOfCrisis';
import NoResource from '../../components/NoResource';
import ObservedBehaviors from '../pages/observedbehaviors/ObservedBehaviors';
import OfficerSafety from '../pages/officersafety/OfficerSafety';
import ProgressSidebar from '../../components/form/ProgressSidebar';
import SubjectInformation from '../pages/subjectinformation/SubjectInformation';
import SubmitSuccess from '../../components/crisis/SubmitSuccess';
import { HOME_PATH, REPORT_ID_PARAM } from '../../core/router/Routes';
import { getAuthorization } from '../../core/sagas/authorize/AuthorizeActions';
import { MEDIA_QUERY_LG, MEDIA_QUERY_MD } from '../../core/style/Sizes';
import { FORM_TYPE } from '../../utils/DataConstants';
import {
  getCurrentPage,
  getNextPath,
  getPrevPath,
  setShowInvalidFields
} from '../../utils/NavigationUtils';
import { POST_PROCESS_FIELDS } from '../../utils/constants/CrisisReportConstants';
import { FORM_STEP_STATUS } from '../../utils/constants/FormConstants';
import { STATE } from '../../utils/constants/StateConstants';
import {
  getStatus as validateDisposition,
  processForSubmit as processDisposition
} from '../pages/disposition/Reducer';
import {
  getStatus as validateNatureOfCrisis,
  processForSubmit as processNatureOfCrisis
} from '../pages/natureofcrisis/Reducer';
import {
  getStatus as validateObservedBehaviors,
  processForSubmit as processObservedBehaviors
} from '../pages/observedbehaviors/Reducer';
import {
  getStatus as validateOfficerSafety,
  processForSubmit as processOfficerSafety
} from '../pages/officersafety/Reducer';
import {
  getStatus as validateSubjectInformation,
  processForSubmit as processSubjectInformation
} from '../pages/subjectinformation/Reducer';

const CrisisReportWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin: 0;
  width: 100%;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 10px;
    max-width: 100%;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    padding: 15px;
  }
`;

const FormWrapper = styled.div`
  padding: 5px;
  width: 100%;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 10px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    padding: 15px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 0 10px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    padding: 0 15px;
  }
`;

const PAGES = [
  {
    Component: SubjectInformation,
    validator: validateSubjectInformation,
    title: 'Person Information',
    stateField: STATE.SUBJECT_INFORMATION,
    postProcessor: processSubjectInformation
  },
  {
    Component: ObservedBehaviors,
    validator: validateObservedBehaviors,
    title: 'Observed Behaviors',
    stateField: STATE.OBSERVED_BEHAVIORS,
    postProcessor: processObservedBehaviors
  },
  {
    Component: NatureOfCrisis,
    validator: validateNatureOfCrisis,
    title: 'Nature of Crisis, Assistance, and Housing',
    stateField: STATE.NATURE_OF_CRISIS,
    postProcessor: processNatureOfCrisis
  },
  {
    Component: OfficerSafety,
    validator: validateOfficerSafety,
    title: 'Officer Safety',
    stateField: STATE.OFFICER_SAFETY,
    postProcessor: processOfficerSafety
  },
  {
    Component: Disposition,
    validator: validateDisposition,
    title: 'Disposition',
    stateField: STATE.DISPOSITION,
    postProcessor: processDisposition
  },
  {
    Component: ReviewContainer,
    title: 'Review',
    stateField: '',
    postProcessor: () => ({}),
    requireAllPreviousValid: true
  }
];

type Props = {
  actions :{
    clearReport :() => { type :string };
    deleteReport :RequestSequence;
    getAuthorization :RequestSequence;
    getReport :RequestSequence;
    updateReport :RequestSequence;
  };
  deleteState :RequestState;
  fetchState :RequestState;
  history :RouterHistory;
  lastUpdatedStaff :Map;
  match :Match;
  state :Map;
  submittedStaff :Map;
  updateState :RequestState;
};

type State = {
  edit :boolean;
  showDiscard :boolean;
  showDelete :boolean;
}

class CrisisReportView extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      edit: false,
      showDelete: false,
      showDiscard: false,
    };
  }

  componentDidMount() {
    const { actions, match } = this.props;

    const reportEKID :?UUID = match.params[REPORT_ID_PARAM];
    actions.getReport(reportEKID);
  }

  componentWillUnmount() {
    const { actions } = this.props;
    actions.clearReport();
  }

  handlePageChange = (path :string) => {
    const { history } = this.props;
    history.push(path);
    window.scrollTo({
      top: 0
    });
  }

  handleEditClick = () => {
    this.setState({
      edit: true
    });
  }

  handleShowDiscard = () => {
    this.setState({
      showDiscard: true
    });
  }

  handleCloseDiscard = () => {
    this.setState({
      showDiscard: false
    });
  }

  handleShowDelete = () => {
    this.setState({
      showDelete: true,
    });
  }

  handleCloseDelete = () => {
    this.setState({
      showDelete: false,
    });
  }

  handleDiscard = () => {
    const { actions, history } = this.props;
    actions.clearReport();
    history.push(HOME_PATH);
  }

  handleDelete = () => {
    const { actions, match } = this.props;
    const reportEKID :?UUID = match.params[REPORT_ID_PARAM];
    actions.deleteReport(reportEKID);
  }

  handleSubmit = () => {

    const {
      actions,
      state,
      match
    } = this.props;

    const reportEKID :?UUID = match.params[REPORT_ID_PARAM];

    let submission = {
      [POST_PROCESS_FIELDS.FORM_TYPE]: FORM_TYPE.CRISIS_REPORT,
      [POST_PROCESS_FIELDS.TIMESTAMP]: DateTime.local().toISO(),
      [POST_PROCESS_FIELDS.USER_EMAIL]: AuthUtils.getUserInfo().email
    };

    PAGES.forEach((page :any) => {
      const { postProcessor, stateField } = page;
      submission = { ...submission, ...postProcessor(state.get(stateField)) };
    });

    actions.updateReport({
      entityKeyId: reportEKID,
      formData: submission,
    });
  }

  isReadyToSubmit = () => {
    const { state } = this.props;
    let ready = true;
    PAGES.forEach((page :any) => {
      const { validator, stateField } = page;
      if (validator && validator(state.get(stateField)) !== FORM_STEP_STATUS.COMPLETED) {
        ready = false;
      }
    });

    return ready;
  }

  renderForwardButton = (page :any, index) => {
    const { state } = this.props;
    const { edit } = this.state;

    const isReview = index === PAGES.length - 2;
    const isSubmit = index === PAGES.length - 1;

    if (isSubmit && !edit) {
      return null;
    }

    const { validator, stateField } = page;
    const complete = validator ? validator(state.get(stateField)) === FORM_STEP_STATUS.COMPLETED : true;
    const nextPath = getNextPath(window.location, PAGES.length + 1);

    const hasInvalidFields = (isSubmit || isReview) ? !this.isReadyToSubmit() : !complete;
    let onClick = () => this.handlePageChange(nextPath);

    if (hasInvalidFields) {
      const showInvalidFieldsPath = setShowInvalidFields(window.location);
      onClick = () => this.handlePageChange(showInvalidFieldsPath);
    }

    let buttonText = 'Next';
    if (isReview) {
      buttonText = 'Review';
    }
    if (isSubmit) {
      buttonText = 'Submit';
      onClick = this.handleSubmit;
    }

    return <Button mode="primary" onClick={onClick}>{buttonText}</Button>;
  }

  renderPage = (page, index) => {
    const { edit } = this.state;
    const { Component } = page;
    const prevPath = getPrevPath(window.location);
    return (
      <>
        <FormWrapper>
          <Component disabled={!edit} />
        </FormWrapper>
        <ButtonRow>
          <Button mode="subtle" disabled={!index} onClick={() => this.handlePageChange(prevPath)}>Back</Button>
          {this.renderForwardButton(page, index)}
        </ButtonRow>
      </>
    );
  }

  renderRoutes = () => {
    const { match } = this.props;
    const currentPath :string = match.url;
    return PAGES.map((page, index) => {
      const path = `${currentPath}/${index + 1}`;
      return <Route key={path} path={path} render={() => this.renderPage(page, index)} />;
    });
  }

  getSidebarSteps = () => {
    const { history, state, match } = this.props;
    const currentPath :string = match.url;

    return PAGES.map((page, index) => {
      const {
        title,
        validator,
        stateField,
      } :any = page;
      const status = validator ? validator(state.get(stateField)) : undefined;
      const onClick = () => history.push(`${currentPath}/${index + 1}`);

      return {
        disabled: false,
        onClick,
        status,
        title,
      };
    });
  }

  render() {
    const {
      actions,
      deleteState,
      fetchState,
      lastUpdatedStaff,
      match,
      submittedStaff,
      updateState,
    } = this.props;
    const { edit, showDelete, showDiscard } = this.state;
    const baseUrl = `${match.url}/1`;
    const currentPage = getCurrentPage(window.location);

    let primaryClick = this.handleEditClick;
    if (edit) primaryClick = this.handleShowDiscard;

    if (
      fetchState === RequestStates.PENDING
      || updateState === RequestStates.PENDING
      || deleteState === RequestStates.PENDING
    ) {
      return <Spinner size="3x" />;
    }

    if (fetchState === RequestStates.FAILURE) return <NoResource />;

    if (updateState === RequestStates.SUCCESS) return <SubmitSuccess actionText="updated" />;
    if (deleteState === RequestStates.SUCCESS) return <SubmitSuccess actionText="deleted" />;

    return (
      <CrisisReportWrapper>
        {
          currentPage > PAGES.length ? null : (
            <ProgressSidebar
                formTitle="Review Crisis Report"
                currentStepNumber={currentPage - 1}
                steps={this.getSidebarSteps()} />
          )
        }
        <PageWrapper>
          <FormWrapper>
            <FormRecord
                authorize={actions.getAuthorization}
                lastUpdated={lastUpdatedStaff}
                onClickPrimary={primaryClick}
                onClickSecondary={this.handleShowDelete}
                primaryText={edit ? 'Discard' : 'Edit'}
                submitted={submittedStaff} />
          </FormWrapper>
          <Switch>
            {this.renderRoutes()}
            <Redirect to={baseUrl} />
          </Switch>
        </PageWrapper>
        <DiscardModal
            isVisible={showDiscard}
            onClickPrimary={this.handleDiscard}
            onClose={this.handleCloseDiscard} />
        <DeleteModal
            isVisible={showDelete}
            onClickPrimary={this.handleDelete}
            onClose={this.handleCloseDelete} />
      </CrisisReportWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    fetchState: state.getIn(['reports', 'fetchState'], RequestStates.STANDBY),
    updateState: state.getIn(['reports', 'updateState'], RequestStates.STANDBY),
    deleteState: state.getIn(['reports', 'deleteState'], RequestStates.STANDBY),
    lastUpdatedStaff: state.getIn(['reports', 'lastUpdatedStaff'], Map()),
    state,
    submittedStaff: state.getIn(['reports', 'submittedStaff'], Map()),
  };
}

function mapDispatchToProps(dispatch :Dispatch<*>) :Object {

  const actions = {
    clearReport,
    deleteReport,
    getAuthorization,
    getReport,
    updateReport,
  };

  return {
    // $FlowFixMe
    actions: bindActionCreators(actions, dispatch)
  };
}

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CrisisReportView)
);
