/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

import { Constants } from 'lattice';
import { AuthUtils } from 'lattice-auth';
import { DateTime } from 'luxon';
import { Map, getIn } from 'immutable';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Button, Spinner } from 'lattice-ui-kit';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RequestStates } from 'redux-reqseq';
import type { RequestSequence, RequestState } from 'redux-reqseq';
import type { RouterHistory, Location } from 'react-router';

import DiscardModal from '../../components/modals/DiscardModal';
import Disposition from '../pages/disposition/Disposition';
import NatureOfCrisis from '../pages/natureofcrisis/NatureOfCrisis';
import ObservedBehaviors from '../pages/observedbehaviors/ObservedBehaviors';
import OfficerSafety from '../pages/officersafety/OfficerSafety';
import ProgressSidebar from '../../components/form/ProgressSidebar';
import ReviewContainer from './ReviewContainer';
import SubjectInformationManager from '../pages/subjectinformation/SubjectInformationManager';
import SubmitSuccess from '../../components/crisis/SubmitSuccess';
import { FormWrapper as StyledPageWrapper } from '../../components/crisis/FormComponents';

import { clearReport, submitReport } from './ReportsActions';
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
import { POST_PROCESS_FIELDS } from '../../utils/constants/CrisisReportConstants';
import { FORM_TYPE } from '../../utils/DataConstants';
import { CRISIS_PATH, HOME_PATH } from '../../core/router/Routes';
import { MEDIA_QUERY_MD, MEDIA_QUERY_LG } from '../../core/style/Sizes';

const { OPENLATTICE_ID_FQN } = Constants;

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

const SubmittedView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  min-height: 230px;
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

type Props = {
  actions :{
    clearReport :() => void,
    submitReport :RequestSequence;
  },
  history :RouterHistory,
  location :Location,
  state :Map,
  submitState :RequestState;
};

type State = {
  showDiscard :boolean;
  formInProgress :boolean;
  personEKID ? :string;
}

class CrisisReportContainer extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      personEKID: getIn(props.location, [
        'state',
        OPENLATTICE_ID_FQN,
        0
      ]),
      showDiscard: false,
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
    actions.clearReport();
  }

  handleCloseDiscard = () => {
    this.setState({ showDiscard: false });
  }

  handleShowDiscard = () => {
    this.setState({ showDiscard: true });
  }

  handleDiscard = () => {
    const { actions, history } = this.props;
    actions.clearReport();
    history.push(HOME_PATH);
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
      state
    } = this.props;
    const { personEKID } = this.state;

    let submission = {
      [POST_PROCESS_FIELDS.FORM_TYPE]: FORM_TYPE.CRISIS_REPORT,
      [POST_PROCESS_FIELDS.TIMESTAMP]: DateTime.local().toISO(),
      [POST_PROCESS_FIELDS.USER_EMAIL]: AuthUtils.getUserInfo().email
    };

    PAGES.forEach((page) => {
      const { postProcessor, stateField } = page;
      submission = { ...submission, ...postProcessor(state.get(stateField)) };
    });

    actions.submitReport({
      entityKeyId: personEKID,
      formData: submission
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

    const isReview = index === PAGES.length - 2;
    const isSubmit = index === PAGES.length - 1;

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

    const { Component } = page;
    const prevPath = getPrevPath(window.location);
    return (
      <PageWrapper>
        <FormWrapper>
          <Component />
        </FormWrapper>
        <ButtonRow>
          { index === 0
            ? <Button mode="subtle" onClick={this.handleShowDiscard}>Discard</Button>
            : <Button mode="subtle" onClick={() => this.handlePageChange(prevPath)}>Back</Button>}
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

    return PAGES.map((page :any, index :number) => {
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

  render() {
    const { submitState } = this.props;

    const { showDiscard } = this.state;

    const currentPage = getCurrentPage(window.location);

    if (submitState === RequestStates.PENDING) {
      return (
        <PageWrapper>
          <StyledPageWrapper>
            <CrisisReportWrapper>
              <SubmittedView>
                <Spinner size="3x" />
              </SubmittedView>
            </CrisisReportWrapper>
          </StyledPageWrapper>
        </PageWrapper>
      );
    }

    if (submitState === RequestStates.SUCCESS) {
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
        <Switch>
          {this.renderRoutes()}
          <Redirect to={START_PATH} />
        </Switch>
        <DiscardModal
            isVisible={showDiscard}
            onClickPrimary={this.handleDiscard}
            onClose={this.handleCloseDiscard} />
      </CrisisReportWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    state,
    submitState: state.getIn(['reports', 'submitState'], RequestStates.STANDBY),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    clearReport,
    submitReport,
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CrisisReportContainer)
);
