/*
 * @flow
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import SearchPeopleContainer from './SearchPeopleContainer';
import ProfileContainer from '../profile/ProfileContainer';
import { clearSearchResults, editPerson } from './PeopleActions';

type Props = {
  selectedPerson :Map<*, *>,
  actions :{
    editPerson :(person :Map<*, *>) => void,
    clearSearchResults :() => void
  }
}

class PeopleContainer extends React.Component<Props> {

  componentWillUnmount() {
    const { actions } = this.props;
    actions.clearSearchResults();
  }

  render() {
    const { selectedPerson } = this.props;

    return (
      <>
        {
          selectedPerson.size
            ? <ProfileContainer />
            : <SearchPeopleContainer />
        }
      </>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    app: state.get('app', Map()),
    selectedPerson: state.getIn(['profile', 'selectedPerson'], Map()),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    clearSearchResults,
    editPerson
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PeopleContainer);
