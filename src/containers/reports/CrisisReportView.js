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

import type { Match, RouterHistory } from 'react-router';
import type { Dispatch } from 'redux';

import FormRecordCard from '../../components/form/FormRecord';
import Spinner from '../../components/spinner/Spinner';
import BackButton from '../../components/buttons/BackButton';
import ProgressSidebar from '../../components/form/ProgressSidebar';
import SubjectInformation from '../pages/subjectinformation/SubjectInformation';
import ObservedBehaviors from '../pages/observedbehaviors/ObservedBehaviors';
import NatureOfCrisis from '../pages/natureofcrisis/NatureOfCrisis';
import OfficerSafety from '../pages/officersafety/OfficerSafety';
import Disposition from '../pages/disposition/Disposition';

import { getReport } from './ReportsActions';
import { clearCrisisTemplate } from '../crisis/CrisisActionFactory';
import {
  getCurrentPage,
  getNextPath,
  getPrevPath,
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
import { STATE } from '../../utils/constants/StateConstants';
import { REPORT_ID_PARAM } from '../../core/router/Routes';
import { MEDIA_QUERY_MD, MEDIA_QUERY_LG } from '../../core/style/Sizes';
import RequestStates from '../../utils/constants/RequestStates';
import type { RequestState } from '../../utils/constants/RequestStates';

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
];

type Props = {
  actions :{
    hardRestart :() => void,
    clearCrisisTemplate :() => void,
    submit :(args :Object) => void,
    getReport :RequestSequence;
  },
  history :RouterHistory,
  match :Match;
  state :Map<*, *>,
  fetchState :RequestState,
};

class CrisisTemplateContainer extends React.Component<Props> {

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

  renderForwardButton = (page, index) => {
    const isSubmit = index === PAGES.length - 1;
    const nextPath = getNextPath(window.location, PAGES.length + 1);

    const onClick = () => this.handlePageChange(nextPath);

    const buttonText = 'Next';
    if (isSubmit) {
      return null;
    }

    return <ForwardButton onClick={onClick} canProgress>{buttonText}</ForwardButton>;
  }

  renderPage = (page, index) => {

    const { Component } = page;
    const prevPath = getPrevPath(window.location);
    return (
      <>
        <div>
          <Component disabled />
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
      const status = validator(state.get(stateField));
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
      fetchState,
      match
    } = this.props;
    const baseUrl = `${match.url}/1`;
    const currentPage = getCurrentPage(window.location);

    if (fetchState === RequestStates.IS_REQUESTING) {
      return <Spinner />;
    }

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
            <FormRecordCard />
            <Switch>
              {this.renderRoutes()}
              <Redirect to={baseUrl} />
            </Switch>
          </FormWrapper>
        </PageWrapper>
      </CrisisTemplateWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    state,
    fetchState: state.getIn(['reports', 'fetchState'], RequestStates.PRE_REQUEST),
  };
}

function mapDispatchToProps(dispatch :Dispatch<*>) :Object {

  const actions = {
    clearCrisisTemplate,
    getReport
  };

  return {
    // $FlowFixMe
    actions: bindActionCreators(actions, dispatch)
  };
}

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CrisisTemplateContainer)
);
