// @flow

import React, { Component } from 'react';
import { List, Map } from 'immutable';
import { Search } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import PersonResult from './PersonResult';
import { resultLabels, searchFields } from './constants';
import { ContentWrapper } from '../../components/layout';
import { searchPeople, selectPerson } from './PeopleActions';

type Props = {
  actions :{
    searchPeople :RequestSequence;
    selectPerson :RequestSequence;
  };
  searchResults :List<Map>;
  fetchState :RequestState;
}

class NewSearchPeopleContainer extends Component<Props> {

  handleOnSearch = (searchValues :Map) => {
    const { actions } = this.props;
    const hasValues = searchValues.reduce((notEmpty, value) => {
      return notEmpty || !!value;
    }, false);
    if (hasValues) {
      actions.searchPeople(searchValues);
    }
  }

  handleResultClick = (person :Map) => {
    const { actions } = this.props;
    actions.selectPerson(person);
  }

  render() {
    const { fetchState, searchResults } = this.props;
    return (
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
    );
  }
}

const mapStateToProps = state => ({
  searchResults: state.getIn(['people', 'peopleSearchResults'], List()),
  fetchState: state.getIn(['people', 'fetchState'])
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    searchPeople,
    selectPerson,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(NewSearchPeopleContainer);
