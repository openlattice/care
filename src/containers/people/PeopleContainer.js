/*
 * @flow
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import SearchPeopleContainer from './SearchPeopleContainer';
import EditPerson from '../../components/people/EditPerson';
import { clearSearchResults, editPerson, selectPerson } from './PeopleActions';
import { StyledSectionWrapper } from '../../components/form/StyledFormComponents';

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
    const { isEditingPerson, selectedPerson } = this.props;

    return (
      <>
        {
          selectedPerson.size
            ? (
              <StyledSectionWrapper>
                <EditPerson
                    inputPerson={selectedPerson}
                    isSavingChanges={isEditingPerson}
                    backToSearch={() => this.handlePersonSelection(Map())}
                    handleSubmit={this.handleEdit} />
              </StyledSectionWrapper>
            )
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
    isEditingPerson: state.getIn(['people', 'isEditingPerson'], false)
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
