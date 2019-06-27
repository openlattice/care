/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import { Map } from 'immutable';
import { DateTime } from 'luxon';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AuthUtils } from 'lattice-auth';

import type { RouterHistory } from 'react-router';

import Spinner from '../../components/spinner/Spinner';
import ReviewContainer from './ReviewContainer';
import BackButton from '../../components/buttons/BackButton';
import ProgressSidebar from '../../components/form/ProgressSidebar';
import SubjectInformationManager from '../pages/subjectinformation/SubjectInformationManager';
import ObservedBehaviors from '../pages/observedbehaviors/ObservedBehaviors';
import NatureOfCrisis from '../pages/natureofcrisis/NatureOfCrisis';
import OfficerSafety from '../pages/officersafety/OfficerSafety';
import Disposition from '../pages/disposition/Disposition';
import submitConfig from '../../config/formconfig/CrisisReportConfig';
import SubmitSuccess from '../../components/crisis/SubmitSuccess';
import { FormWrapper as StyledPageWrapper } from '../../components/crisis/FormComponents';

import { submit } from '../../utils/submit/SubmitActionFactory';
import { clearCrisisReport } from './CrisisActionFactory';
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
import { STATE, SUBMIT } from '../../utils/constants/StateConstants';
import { POST_PROCESS_FIELDS } from '../../utils/constants/CrisisReportConstants';
import { FORM_TYPE } from '../../utils/DataConstants';
import { CRISIS_PATH, HOME_PATH } from '../../core/router/Routes';
import { MEDIA_QUERY_MD, MEDIA_QUERY_LG } from '../../core/style/Sizes';
import { BLACK, INVALID_TAG } from '../../shared/Colors';

type Props = {
  actions :{
    clearCrisisReport :() => void,
    submit :(args :Object) => void
  },
  app :Map<*, *>,
  history :RouterHistory,
  state :Map<*, *>,
  isSubmitting :boolean,
  isSubmitted :boolean
};

type State = {
  confirmReset :boolean,
  formInProgress :boolean
}

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
  justify-content: flex-end;
  align-items: center;
`;


const ResetModalBody = styled.div`
  padding: 10px;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 20px;
  }

  h1 {
    color: ${INVALID_TAG};
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 20px;
  }

  p {
    color: ${BLACK};
    font-size: 14px;
    padding-bottom: 10px;
  }
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

const SubmittedView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  min-height: 230px;

  h1 {
    color: ${BLACK};
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
  }

  ${ForwardButton} {
    background-color: #6124e2;
    color: #f8f8fb;
    padding: 12px 20px;
    margin-bottom: 5px;

    &:hover {
      background-color: #8045ff;
    }
  }
`;

const PAGES = [
  {
    Component: SubjectInformationManager,
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
    title: 'Review & Submit',
    stateField: '',
    postProcessor: () => ({}),
    requireAllPreviousValid: true
  }
];

const START_PATH = `${CRISIS_PATH}/1`;

class CrisisReportContainer extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      confirmReset: false,
      formInProgress: false
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const { formInProgress } = this.state;

    if (!formInProgress && !window.location.href.endsWith(START_PATH)) {
      history.push(START_PATH);
    }
    this.setState({ formInProgress: true });
  }

  componentWillUnmount() {
    const { actions } = this.props;
    actions.clearCrisisReport();
  }

  handlePageChange = (path) => {
    const { history } = this.props;
    history.push(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  handleSubmit = (event :SyntheticEvent<*>) => {

    event.preventDefault();

    const {
      actions,
      app,
      state
    } = this.props;

    let submission = {
      [POST_PROCESS_FIELDS.FORM_TYPE]: FORM_TYPE.CRISIS_REPORT,
      [POST_PROCESS_FIELDS.TIMESTAMP]: DateTime.local().toISO(),
      [POST_PROCESS_FIELDS.USER_EMAIL]: AuthUtils.getUserInfo().email
    };

    PAGES.forEach((page) => {
      const { postProcessor, stateField } = page;
      submission = Object.assign({}, submission, postProcessor(state.get(stateField)));
    });

    actions.submit({
      app,
      config: submitConfig,
      values: submission
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

    const isReview = index === PAGES.length - 2;
    const isSubmit = index === PAGES.length - 1;

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

    const { Component } = page;
    const prevPath = getPrevPath(window.location);
    return (
      <PageWrapper>
        <FormWrapper>
          <Component />
        </FormWrapper>
        <ButtonRow>
          { index === 0
            ? <BackButton onClick={() => this.setState({ confirmReset: true })}>Reset</BackButton>
            : <BackButton onClick={() => this.handlePageChange(prevPath)}>Back</BackButton>
          }
          {this.renderForwardButton(page, index)}
        </ButtonRow>
      </PageWrapper>
    );
  }

  renderRoutes = () => PAGES.map((page, index) => {
    const path = `${CRISIS_PATH}/${index + 1}`;
    return <Route key={path} path={path} render={() => this.renderPage(page, index)} />;
  })

  getSidebarSteps = () => {
    const { history, state } = this.props;

    return PAGES.map((page, index) => {
      const {
        title,
        validator,
        stateField,
        requireAllPreviousValid
      } = page;
      const status = validator ? validator(state.get(stateField)) : undefined;
      const onClick = () => history.push(`${CRISIS_PATH}/${index + 1}`);
      let disabled = false;
      if (requireAllPreviousValid) {
        PAGES.slice(0, index).forEach((prevPage) => {
          if (prevPage.validator && prevPage.validator(state.get(prevPage.stateField)) !== FORM_STEP_STATUS.COMPLETED) {
            disabled = true;
          }
        });
      }

      return {
        title,
        status,
        onClick,
        disabled
      };
    });
  }

  renderResetModal = () => {
    const { actions, history } = this.props;
    const doReset = () => {
      actions.clearCrisisReport();
      history.push(HOME_PATH);
    };

    return (
      <ResetModalBody>
        <h1>Close and delete report</h1>
        <p>{'Warning! Clicking "Close and delete" will delete all data you have entered into this crisis report.'}</p>
        <p>Are you sure you want to exit the report and delete the content?</p>
        <ButtonRow>
          <BackButton onClick={doReset}>Close and Delete</BackButton>
          <ForwardButton onClick={() => this.setState({ confirmReset: false })} canProgress>Stay on Page</ForwardButton>
        </ButtonRow>
      </ResetModalBody>
    );
  }

  render() {
    const {
      actions,
      history,
      isSubmitting,
      isSubmitted
    } = this.props;

    const { confirmReset } = this.state;

    const currentPage = getCurrentPage(window.location);

    if (isSubmitting) {
      return (
        <PageWrapper>
          <StyledPageWrapper>
            <CrisisReportWrapper>
              <SubmittedView>
                <Spinner />
              </SubmittedView>
            </CrisisReportWrapper>
          </StyledPageWrapper>
        </PageWrapper>
      );
    }

    if (isSubmitted) {
      return <SubmitSuccess actionText="submitted" />;
    }

    return (
      <CrisisReportWrapper>
        {
          currentPage > PAGES.length ? null : (
            <ProgressSidebar
                formTitle="New Crisis Report"
                currentStepNumber={currentPage - 1}
                steps={this.getSidebarSteps()} />
          )
        }
        <ModalTransition>
          {confirmReset && (
            <Modal onClose={() => this.setState({ confirmReset: false })}>
              {this.renderResetModal()}
            </Modal>
          )}
        </ModalTransition>
        <Switch>
          {this.renderRoutes()}
          <Redirect to={START_PATH} />
        </Switch>
      </CrisisReportWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    app: state.get('app', Map()),
    state,
    isSubmitting: state.getIn([STATE.SUBMIT, SUBMIT.SUBMITTING], false),
    isSubmitted: state.getIn([STATE.SUBMIT, SUBMIT.SUBMITTED], false),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    clearCrisisReport,
    submit,
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CrisisReportContainer)
);
