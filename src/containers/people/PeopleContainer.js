/*
 * @flow
 */

import React from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SearchPeopleContainer from './SearchPeopleContainer';
import ProfileContainer from '../profile/ProfileContainer';
import { clearSelectedPerson } from '../profile/ProfileActions';
import { PEOPLE_PATH, PROFILE_PATH } from '../../core/router/Routes';

type Props = {
  actions :{
    clearSelectedPerson :() => void;
  }
}

class PeopleContainer extends React.Component<Props> {

  componentWillUnmount() {
    const { actions } = this.props;
    actions.clearSelectedPerson();
  }

  render() {

    return (
      <Switch>
        <Route exact path={PEOPLE_PATH} component={SearchPeopleContainer} />
        <Route path={PROFILE_PATH} component={ProfileContainer} />
        <Redirect to={PEOPLE_PATH} />
      </Switch>
    );
  }
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    clearSelectedPerson,
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

// $FlowFixMe
export default connect(null, mapDispatchToProps)(PeopleContainer);
