// @flow
import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
  CardStack,
  Stepper,
} from 'lattice-ui-kit';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import type { Match } from 'react-router';
import type { Dispatch } from 'redux';
import type { RequestSequence } from 'redux-reqseq';

import LinkButton from '../../../components/buttons/LinkButton';
import AboutForm from './about/AboutForm';
import ContactsForm from './contacts/ContactsForm';
import ProfileBanner from '../ProfileBanner';
import NavStep from './NavStep';
import ResponsePlanForm from './responseplan/ResponsePlanForm';
import BasicInformationContainer from './basicinformation/BasicInformationContainer';
import OfficerSafetyContainer from './officersafety/OfficerSafetyContainer';
import { getBasics } from './basicinformation/actions/BasicInformationActions';
import { getAuthorization } from '../../../core/sagas/authorize/AuthorizeActions';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import {
  ABOUT_PATH,
  BASIC_PATH,
  CONTACTS_PATH,
  OFFICER_SAFETY_PATH,
  PROFILE_ID_PARAM,
  PROFILE_PATH,
  RESPONSE_PLAN_PATH,
} from '../../../core/router/Routes';
import PrivateRoute from '../../../components/route/PrivateRoute';

type Props = {
  actions :{
    getAuthorization :RequestSequence;
    getBasics :RequestSequence;
  };
  match :Match;
  selectedPerson :Map;
};

const EditProfileContainer = (props :Props) => {
  const { actions, match, selectedPerson } = props;
  const personEKID = match.params[PROFILE_ID_PARAM];

  useEffect(
    () => {
      actions.getBasics(personEKID);
    },
    [actions, personEKID]
  );

  return (
    <ContentOuterWrapper>
      <ProfileBanner selectedPerson={selectedPerson} />
      <ContentWrapper>
        <CardStack>
          <div>
            <LinkButton mode="subtle" to={match.url}>
              <FontAwesomeIcon icon={faArrowLeft} fixedWidth />
              Back to Profile
            </LinkButton>
          </div>
          <Card>
            <CardSegment padding="sm">
              <Stepper>
                <NavStep to={`${match.url}${BASIC_PATH}`}>Basic Information</NavStep>
                <NavStep to={`${match.url}${OFFICER_SAFETY_PATH}`}>Officer Safety</NavStep>
                <NavStep to={`${match.url}${RESPONSE_PLAN_PATH}`}>Background & Response Plan</NavStep>
                <NavStep to={`${match.url}${CONTACTS_PATH}`}>Contacts</NavStep>
                <NavStep to={`${match.url}${ABOUT_PATH}`}>About</NavStep>
              </Stepper>
            </CardSegment>
          </Card>
          <Switch>
            <PrivateRoute
                authorize={actions.getAuthorization}
                path={`${match.path}${BASIC_PATH}`}
                component={BasicInformationContainer} />
            <PrivateRoute
                authorize={actions.getAuthorization}
                path={`${match.path}${OFFICER_SAFETY_PATH}`}
                component={OfficerSafetyContainer} />
            <PrivateRoute
                authorize={actions.getAuthorization}
                path={`${match.path}${RESPONSE_PLAN_PATH}`}
                component={ResponsePlanForm} />
            <PrivateRoute
                authorize={actions.getAuthorization}
                path={`${match.path}${CONTACTS_PATH}`}
                component={ContactsForm} />
            <PrivateRoute
                authorize={actions.getAuthorization}
                path={`${match.path}${ABOUT_PATH}`}
                component={AboutForm} />
            <Redirect to={PROFILE_PATH} />
          </Switch>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

const mapStateToProps = (state :Map) => ({
  selectedPerson: state.getIn(['profile', 'basicInformation', 'basics', 'data'], Map()),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getAuthorization,
    getBasics,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(EditProfileContainer);
