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

import type { RouterHistory } from 'react-router';

import ReviewContainer from './ReviewContainer';
import BackButton from '../../components/buttons/BackButton';
import ProgressSidebar from '../../components/form/ProgressSidebar';
import SubjectInformation from '../pages/subjectinformation/SubjectInformation';
import ObservedBehaviors from '../pages/observedbehaviors/ObservedBehaviors';
import NatureOfCrisis from '../pages/natureofcrisis/NatureOfCrisis';
import OfficerSafety from '../pages/officersafety/OfficerSafety';
import Disposition from '../pages/disposition/Disposition';
import submitConfig from '../../config/formconfig/CrisisTemplateConfig';
import { FormWrapper as StyledPageWrapper } from '../../components/crisis/FormComponents';

import { hardRestart } from '../form/ReportActionFactory';
import { submit } from '../../utils/submit/SubmitActionFactory';
import { clearCrisisTemplate } from './CrisisActionFactory';
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
import { CRISIS_PATH } from '../../core/router/Routes';
import { MEDIA_QUERY_MD, MEDIA_QUERY_LG } from '../../core/style/Sizes';
import { BLACK } from '../../shared/Colors';

type Props = {
  actions :{
    hardRestart :() => void,
    clearCrisisTemplate :() => void,
    submit :(args :Object) => void
  },
  app :Map<*, *>,
  history :RouterHistory,
  submissionState :number,
  state :Map<*, *>
};

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
  padding: 5px;
  width: 100%;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 10px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    padding: 15px;
  }
`;

const SpacedRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const ReviewHeader = styled.div`
  font-size: 16px;
  color: ${BLACK};

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    font-size: 18px;
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

const PAGES = [
  {
    Component: SubjectInformation,
    validator: validateSubjectInformation,
    title: 'Subject Information',
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
  }
];

class CrisisTemplateContainer extends React.Component<Props> {

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

  handleSubmit = (event :SyntheticEvent<*>) => {

    event.preventDefault();

    const { actions, app, state } = this.props;

    let submission = {
      [POST_PROCESS_FIELDS.FORM_TYPE]: FORM_TYPE.CRISIS_TEMPLATE,
      [POST_PROCESS_FIELDS.TIMESTAMP]: moment().toISOString(true)
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
      if (validator(state.get(stateField)) !== FORM_STEP_STATUS.COMPLETED) {
        ready = false;
      }
    });

    return ready;
  }

  renderForwardButton = (page, isSubmit) => {
    const { state } = this.props;

    const { validator, stateField } = page;
    const complete = validator(state.get(stateField)) === FORM_STEP_STATUS.COMPLETED;
    const nextPath = getNextPath(window.location, PAGES.length + 1);

    const disabled = isSubmit ? !this.isReadyToSubmit() : !complete;
    let onClick = () => this.handlePageChange(nextPath);

    if (disabled) {
      const showInvalidFieldsPath = setShowInvalidFields(window.location);
      onClick = () => this.handlePageChange(showInvalidFieldsPath);
    }

    return <ForwardButton onClick={onClick} canProgress={!disabled}>{isSubmit ? 'Submit' : 'Next'}</ForwardButton>;
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
            ? <BackButton>Reset</BackButton>
            : <BackButton onClick={() => this.handlePageChange(prevPath)}>Back</BackButton>
          }
          {this.renderForwardButton(page, index === PAGES.length - 1)}
        </ButtonRow>
      </PageWrapper>
    );
  }

  renderReview = () => {
    const ready = this.isReadyToSubmit();
    const prevPath = getPrevPath(window.location);

    const buttons = (
      <ButtonRow>
        <BackButton onClick={() => this.handlePageChange(prevPath)}>Back</BackButton>
        <ForwardButton onClick={this.handleSubmit} canProgress={ready}>Submit</ForwardButton>
      </ButtonRow>
    );

    return (
      <PageWrapper>
        <StyledPageWrapper>
          <SpacedRow>
            <ReviewHeader>{`Crisis Template Narrative: ${moment().format('MM-DD-YYYY')}`}</ReviewHeader>
            {buttons}
          </SpacedRow>
          <ReviewContainer />
        </StyledPageWrapper>
        {buttons}
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
      const { title, validator, stateField } = page;
      const status = validator(state.get(stateField));
      const onClick = () => history.push(`${CRISIS_PATH}/${index + 1}`);
      return { title, status, onClick };
    });
  }

  render() {

    const { app, submissionState } = this.props;
    const currentPage = getCurrentPage(window.location);

    return (
      <CrisisTemplateWrapper>
        {
          currentPage > PAGES.length ? null : (
            <ProgressSidebar
                formTitle="Crisis Template"
                currentStepNumber={currentPage - 1}
                steps={this.getSidebarSteps()} />
          )
        }
        <Switch>
          {this.renderRoutes()}
          <Route path={`${CRISIS_PATH}/${PAGES.length + 1}`} render={this.renderReview} />
          <Redirect to={`${CRISIS_PATH}/1`} />
        </Switch>
      </CrisisTemplateWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    app: state.get('app', Map()),
    submissionState: state.getIn(['report', 'submissionState']),
    state
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    hardRestart,
    submit,
    clearCrisisTemplate
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CrisisTemplateContainer)
);
