/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import type { RouterHistory } from 'react-router';

import BackButton from '../../components/buttons/BackButton';
import ProgressSidebar from '../../components/form/ProgressSidebar';
import SubjectInformation from '../pages/subjectinformation/SubjectInformation';
import ObservedBehaviors from '../pages/observedbehaviors/ObservedBehaviors';
import NatureOfCrisis from '../pages/natureofcrisis/NatureOfCrisis';
import OfficerSafety from '../pages/officersafety/OfficerSafety';
import Disposition from '../pages/disposition/Disposition';

import { getCurrentPage, getNextPath, getPrevPath } from '../../utils/NavigationUtils';
import { hardRestart, submitReport } from '../form/ReportActionFactory';
import { clearCrisisTemplate } from './CrisisActionFactory';
import { getStatus as validateSubjectInformation } from '../pages/subjectinformation/Reducer';
import { getStatus as validateObservedBehaviors } from '../pages/observedbehaviors/Reducer';
import { getStatus as validateNatureOfCrisis } from '../pages/natureofcrisis/Reducer';
import { getStatus as validateOfficerSafety } from '../pages/officersafety/Reducer';
import { getStatus as validateDisposition } from '../pages/disposition/Reducer';
import { FORM_STEP_STATUS } from '../../utils/constants/FormConstants';
import { STATE } from '../../utils/constants/StateConstants';
import { CRISIS_PATH } from '../../core/router/Routes';
import { APP_CONTAINER_WIDTH, MEDIA_QUERY_MD, MEDIA_QUERY_LG } from '../../core/style/Sizes';


type Props = {
  actions :{
    hardRestart :() => void,
    submitReport :(args :Object) => void,
    clearCrisisTemplate :() => void
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
  margin: 0 auto;
  width: inherit;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 10px;
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
  width: 100%;
  justify-content: flex-end;
  align-items: center;

  button {
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
      color: #f8f8fb;
      background-color: #6124e2;

      &:disabled {
        background-color: #dcdce7;
        color: #aaafbc;
      }

      &:hover:enabled {
        background-color: #8045ff;
      }
    }
  }
`;

const PAGES = [
  {
    Component: SubjectInformation,
    validator: validateSubjectInformation,
    title: 'Subject Information',
    stateField: STATE.SUBJECT_INFORMATION
  },
  {
    Component: ObservedBehaviors,
    validator: validateObservedBehaviors,
    title: 'Observed Behaviors',
    stateField: STATE.OBSERVED_BEHAVIORS
  },
  {
    Component: NatureOfCrisis,
    validator: validateNatureOfCrisis,
    title: 'Nature of Crisis, Assistance, and Housing',
    stateField: STATE.NATURE_OF_CRISIS
  },
  {
    Component: OfficerSafety,
    validator: validateOfficerSafety,
    title: 'Officer Safety',
    stateField: STATE.OFFICER_SAFETY
  },
  {
    Component: Disposition,
    validator: validateDisposition,
    title: 'Disposition',
    stateField: STATE.DISPOSITION
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

    const { actions, app } = this.props;

    // TODO

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

  renderPage = (page, index) => {
    const { state } = this.props;

    const { Component, validator, stateField } = page;
    const prevPath = getPrevPath(window.location);
    const nextPath = getNextPath(window.location, PAGES.length);
    const complete = validator(state.get(stateField)) === FORM_STEP_STATUS.COMPLETED;
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
          { index === PAGES.length - 1
            ? <button type="button" disabled={!this.isReadyToSubmit()}>Submit</button>
            : <button type="button" disabled={!complete} onClick={() => this.handlePageChange(nextPath)}>Next</button>
          }
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
      const { title, validator, stateField } = page;
      const status = validator(state.get(stateField));
      const onClick = () => history.push(`${CRISIS_PATH}/${index + 1}`);
      return { title, status, onClick };
    });
  }

  render() {

    const { app, submissionState } = this.props;

    return (
      <CrisisTemplateWrapper>
        <ProgressSidebar
            formTitle="Crisis Template"
            currentStepNumber={getCurrentPage(window.location) - 1}
            steps={this.getSidebarSteps()} />
        <Switch>
          {this.renderRoutes()}
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
    submitReport,
    clearCrisisTemplate
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CrisisTemplateContainer)
);
