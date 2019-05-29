/*
 * @flow
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import SearchPeopleContainer from './SearchPeopleContainer';
import ProfileContainer from '../profile/ProfileContainer';
import { clearSearchResults, editPerson, selectPerson } from './PeopleActions';

type Props = {
  app :Map<*, *>,
  selectedPerson :Map<*, *>,
  isEditingPerson :boolean,
  actions :{
    selectPerson :(person :Map<*, *>) => void,
    editPerson :(person :Map<*, *>) => void,
    clearSearchResults :() => void
  }
}

class PeopleContainer extends React.Component<Props> {

  componentWillUnmount() {
    const { actions } = this.props;
    actions.clearSearchResults();
  }

  handlePersonSelection = (person) => {
    const { actions } = this.props;
    actions.selectPerson(person);
  }

  handleEdit = (entity) => {
    const { app, actions } = this.props;
    actions.editPerson({ app, entity });
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
    selectedPerson: state.getIn(['people', 'selectedPerson'], Map()),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    clearSearchResults,
    editPerson,
    selectPerson
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PeopleContainer);
