// @flow
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import type { RequestSequence } from 'redux-reqseq';

import PrivateRoute from '../../../components/route/PrivateRoute';
import PremiumProfileContainer from './PremiumProfileContainer';
import EditProfileContainer from '../edit/EditProfileContainer';

import { getAuthorization } from '../../../core/sagas/authorize/AuthorizeActions';
import { PROFILE_PATH, PROFILE_EDIT_PATH } from '../../../core/router/Routes';

type Props = {
  actions :{
    getAuthorization :RequestSequence;
  };
};

const PremiumProfileRouter = (props :Props) => {
  const { actions } = props;
  return (
    <Switch>
      <Redirect strict exact from={`${PROFILE_PATH}/`} to={PROFILE_PATH} />
      <PrivateRoute
          authorize={actions.getAuthorization}
          component={PremiumProfileContainer}
          exact
          path={PROFILE_PATH} />
      <Route path={PROFILE_EDIT_PATH} component={EditProfileContainer} />
      <Redirect to={PROFILE_PATH} />
    </Switch>
  );
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({ getAuthorization }, dispatch)
});

// $FlowFixMe
export default connect(null, mapDispatchToProps)(PremiumProfileRouter);
