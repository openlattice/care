/*
 * @flow
 */

import React, { useEffect } from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import type { RequestSequence } from 'redux-reqseq';

import ProfileContainer from './ProfileContainer';
import PremiumProfileRouter from './premium/PremiumProfileRouter';
import { clearSearchResults } from '../people/PeopleActions';
import {
  PROFILE_VIEW_PATH,
  HOME_PATH
} from '../../core/router/Routes';

type Props = {
  actions :{
    clearSearchResults :RequestSequence;
  };
  selectedOrganizationSettings :Map;
};

const PeopleRouter = ({ actions, selectedOrganizationSettings } :Props) => {
  const premium = selectedOrganizationSettings.get('premium', false);
  const profileComponent = premium ? PremiumProfileRouter : ProfileContainer;

  // useEffect(() => {
  //   return () => {
  //     actions.clearSearchResults();
  //   };
  // }, [actions]);

  return (
    <Switch>
      <Route strict path={PROFILE_VIEW_PATH} component={profileComponent} />
      <Redirect to={HOME_PATH} />
    </Switch>
  );
};

const mapStateToProps = (state) => ({
  selectedOrganizationSettings: state.getIn(['app', 'selectedOrganizationSettings'], Map())
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    clearSearchResults
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PeopleRouter);
