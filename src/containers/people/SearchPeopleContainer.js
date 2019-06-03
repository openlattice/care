// @flow

import React, { Component } from 'react';
import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { Search } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import PersonResult from './PersonResult';
import { resultLabels, searchFields } from './constants';
import { ContentWrapper, ContentOuterWrapper } from '../../components/layout';
import { searchPeople } from './PeopleActions';
import { selectPerson } from '../profile/ProfileActions';
import { PROFILE_PATH, PROFILE_ID_PATH } from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';
import type { RoutingAction } from '../../core/router/RoutingActions';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  actions :{
    goToPath :(path :string) => RoutingAction;
    searchPeople :RequestSequence;
    selectPerson :RequestSequence;
  };
  searchResults :List<Map>;
  fetchState :RequestState;
}

class SearchPeopleContainer extends Component<Props> {

  handleOnSearch = (searchValues :Map) => {
    const { actions } = this.props;
    const hasValues = searchValues.reduce((notEmpty, value) => notEmpty || !!value, false);

    if (hasValues) {
      actions.searchPeople(searchValues);
    }
  }

  handleResultClick = (person :Map) => {
    const { actions } = this.props;
    const personEKID = person.getIn([OPENLATTICE_ID_FQN, 0]);
    actions.selectPerson(person);
    actions.goToPath(PROFILE_PATH.replace(PROFILE_ID_PATH, personEKID));
  }

  render() {
    const { fetchState, searchResults } = this.props;
    return (
      <ContentOuterWrapper>
        <ContentWrapper>
          <Search
              isLoading={fetchState === RequestStates.PENDING}
              onResultClick={this.handleResultClick}
              onSearch={this.handleOnSearch}
              resultComponent={PersonResult}
              resultLabels={resultLabels}
              searchFields={searchFields}
              searchResults={searchResults}
              title="Search People" />
        </ContentWrapper>
      </ContentOuterWrapper>
    );
  }
}

const mapStateToProps = state => ({
  searchResults: state.getIn(['people', 'peopleSearchResults'], List()),
  fetchState: state.getIn(['people', 'fetchState'])
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    goToPath,
    searchPeople,
    selectPerson,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(SearchPeopleContainer);
