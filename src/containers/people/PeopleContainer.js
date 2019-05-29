/*
 * @flow
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import SearchPeopleContainer from './SearchPeopleContainer';
import ProfileContainer from '../profile/ProfileContainer';
import { clearSearchResults } from './PeopleActions';
import { clearSelectedPerson } from '../profile/ProfileActions';

type Props = {
  selectedPerson :Map<*, *>,
  actions :{
    clearSearchResults :() => void;
    clearSelectedPerson :() => void;
  }
}

class PeopleContainer extends React.Component<Props> {

  componentWillUnmount() {
    const { actions } = this.props;
    actions.clearSearchResults();
    actions.clearSelectedPerson();
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
    clearSelectedPerson,
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PeopleContainer);
