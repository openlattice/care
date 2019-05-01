/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AuthUtils } from 'lattice-auth';
import { ModalTransition } from '@atlaskit/modal-dialog';

import type { Match, RouterHistory } from 'react-router';
import type { Dispatch } from 'redux';

import NoResource from '../../components/NoResource';
import FormRecordCard from '../../components/form/FormRecord';
import Spinner from '../../components/spinner/Spinner';
import ReviewContainer from '../crisis/ReviewContainer';
import BackButton from '../../components/buttons/BackButton';
import ProgressSidebar from '../../components/form/ProgressSidebar';
import SubjectInformation from '../pages/subjectinformation/SubjectInformation';
import ObservedBehaviors from '../pages/observedbehaviors/ObservedBehaviors';
import NatureOfCrisis from '../pages/natureofcrisis/NatureOfCrisis';
import OfficerSafety from '../pages/officersafety/OfficerSafety';
import Disposition from '../pages/disposition/Disposition';
import DiscardModal from '../../components/modals/DiscardModal';
import DeleteModal from '../../components/modals/DeleteModal';
import RequestStates from '../../utils/constants/RequestStates';
import SubmitSuccess from '../../components/crisis/SubmitSuccess';
import type { RequestState } from '../../utils/constants/RequestStates';

import { getReport, updateReport, deleteReport } from './ReportsActions';
import { clearCrisisTemplate } from '../crisis/CrisisActionFactory';
import {
  getCurrentPage,
  getNextPath,
  getPrevPath,
  setShowInvalidFields
} from '../../utils/NavigationUtils';
import {
  getStatus as validateSubjectInformation,
  processForSubmit as processSubjectInformation
} from '../pages/subjectinformation/Reducer';
import {
  getStatus as validateObservedBehaviors,
  processForSubmit as processObservedBehaviors
} from '../pages/observedbehaviors/Reducer';
import {
  getStatus as validateNatureOfCrisis,
  processForSubmit as processNatureOfCrisis
} from '../pages/natureofcrisis/Reducer';
import {
  getStatus as validateOfficerSafety,
  processForSubmit as processOfficerSafety
} from '../pages/officersafety/Reducer';
import {
  getStatus as validateDisposition,
  processForSubmit as processDisposition
} from '../pages/disposition/Reducer';
import { FORM_STEP_STATUS } from '../../utils/constants/FormConstants';
import { STATE } from '../../utils/constants/StateConstants';
import { POST_PROCESS_FIELDS } from '../../utils/constants/CrisisTemplateConstants';
import { FORM_TYPE } from '../../utils/DataConstants';
import { REPORT_ID_PARAM, HOME_PATH } from '../../core/router/Routes';
import { MEDIA_QUERY_MD, MEDIA_QUERY_LG } from '../../core/style/Sizes';

const CrisisTemplateWrapper = styled.div`
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
  max-width: 65vw;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 10px;
    max-width: 100%;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    padding: 15px;
  }
`;

const FormWrapper = styled.div`
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
  justify-content: flex-end;
  align-items: center;
`;

const ForwardButton = styled.button.attrs({
  type: 'button'
})`
  padding: 10px 20px;
  margin: 15px;
  text-transform: uppercase;
  font-size: 14px;
  border-radius: 3px;
  border: none;

  &:focus {
    outline: none;
  }

  &:hover:enabled {
    cursor: pointer;
  }

  &:last-child {
    color: ${props => (props.canProgress ? '#f8f8fb' : '#aaafbc')};
    background-color: ${props => (props.canProgress ? '#6124e2' : '#dcdce7')};

    &:hover:enabled {
      background-color: ${props => (props.canProgress ? '#8045ff' : '#dcdce7')};
    }
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
    clearCrisisTemplate :() => {
      type :string;
    };
    deleteReport :RequestSequence;
    getReport :RequestSequence;
    submit :(args :Object) => void;
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

  state = {
    edit: false,
    showDelete: false,
    showDiscard: false,
  }

  componentDidMount() {
    const { actions, match } = this.props;

    const reportEKID :?UUID = match.params[REPORT_ID_PARAM.substr(1)];
    actions.getReport(reportEKID);
  }

  componentWillUnmount() {
    const { actions } = this.props;
    actions.clearCrisisTemplate();
  }

  handlePageChange = (path) => {
    const { history } = this.props;
    history.push(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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
    actions.clearCrisisTemplate();
    history.push(HOME_PATH);
  }

  handleDelete = () => {
    const { actions, match } = this.props;
    const reportEKID :?UUID = match.params[REPORT_ID_PARAM.substr(1)];
    actions.deleteReport(reportEKID);
  }

  handleSubmit = () => {

    const {
      actions,
      state,
      match
    } = this.props;

    const reportEKID :?UUID = match.params[REPORT_ID_PARAM.substr(1)];

    let submission = {
      [POST_PROCESS_FIELDS.FORM_TYPE]: FORM_TYPE.CRISIS_TEMPLATE,
      [POST_PROCESS_FIELDS.TIMESTAMP]: moment().toISOString(true),
      [POST_PROCESS_FIELDS.USER_EMAIL]: AuthUtils.getUserInfo().email
    };

    PAGES.forEach((page) => {
      const { postProcessor, stateField } = page;
      submission = Object.assign({}, submission, postProcessor(state.get(stateField)));
    });

    actions.updateReport({
      entityKeyId: reportEKID,
      formData: submission,
    });
  }

  isReadyToSubmit = () => {
    const { state } = this.props;
    let ready = true;
    PAGES.forEach((page) => {
      const { validator, stateField } = page;
      if (validator && validator(state.get(stateField)) !== FORM_STEP_STATUS.COMPLETED) {
        ready = false;
      }
    });

    return ready;
  }

  renderForwardButton = (page, index) => {
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

    const disabled = (isSubmit || isReview) ? !this.isReadyToSubmit() : !complete;
    let onClick = () => this.handlePageChange(nextPath);

    if (disabled) {
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

    return <ForwardButton onClick={onClick} canProgress={!disabled}>{buttonText}</ForwardButton>;
  }

  renderPage = (page, index) => {
    const { edit } = this.state;
    const { Component } = page;
    const prevPath = getPrevPath(window.location);
    return (
      <>
        <div>
          <Component disabled={!edit} />
        </div>
        <ButtonRow>
          { (index !== 0) && <BackButton onClick={() => this.handlePageChange(prevPath)}>Back</BackButton> }
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
      } = page;
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

    const discardActions = [
      {
        onClick: this.handleDiscard,
        text: 'Discard Changes'
      },
      {
        onClick: this.handleCloseDiscard,
        text: 'Stay On Page'
      }
    ];

    const deleteActions = [
      {
        onClick: this.handleDelete,
        text: 'Delete Template'
      },
      {
        onClick: this.handleCloseDelete,
        text: 'Stay On Page'
      },
    ];

    let primaryClick = this.handleEditClick;
    if (edit) primaryClick = this.handleShowDiscard;

    if (
      fetchState === RequestStates.IS_REQUESTING
      || updateState === RequestStates.IS_REQUESTING
      || deleteState === RequestStates.IS_REQUESTING
    ) {
      return <Spinner />;
    }

    if (fetchState === RequestStates.REQUEST_FAILURE) return <NoResource />;

    if (updateState === RequestStates.REQUEST_SUCCESS) return <SubmitSuccess actionText="updated" />;
    if (deleteState === RequestStates.REQUEST_SUCCESS) return <SubmitSuccess actionText="deleted" />;

    return (
      <CrisisTemplateWrapper>
        {
          currentPage > PAGES.length ? null : (
            <ProgressSidebar
                formTitle="Review Crisis Template"
                currentStepNumber={currentPage - 1}
                steps={this.getSidebarSteps()} />
          )
        }
        <PageWrapper>
          <FormWrapper>
            <FormRecordCard
                onClickPrimary={primaryClick}
                onClickSecondary={this.handleShowDelete}
                primaryText={edit ? 'Discard' : 'Edit'}
                submitted={submittedStaff}
                lastUpdated={lastUpdatedStaff} />
            <Switch>
              {this.renderRoutes()}
              <Redirect to={baseUrl} />
            </Switch>
          </FormWrapper>
        </PageWrapper>
        <ModalTransition>
          { showDiscard
            && (
              <DiscardModal
                  actions={discardActions}
                  onClose={this.handleCloseDiscard} />
            )
          }
        </ModalTransition>
        <ModalTransition>
          { showDelete
            && (
              <DeleteModal
                  actions={deleteActions}
                  onClose={this.handleCloseDelete} />
            )
          }
        </ModalTransition>
      </CrisisTemplateWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    fetchState: state.getIn(['reports', 'fetchState'], RequestStates.PRE_REQUEST),
    updateState: state.getIn(['reports', 'updateState'], RequestStates.PRE_REQUEST),
    deleteState: state.getIn(['reports', 'deleteState'], RequestStates.PRE_REQUEST),
    lastUpdatedStaff: state.getIn(['reports', 'lastUpdatedStaff'], Map()),
    state,
    submittedStaff: state.getIn(['reports', 'submittedStaff'], Map()),
  };
}

function mapDispatchToProps(dispatch :Dispatch<*>) :Object {

  const actions = {
    clearCrisisTemplate,
    deleteReport,
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
