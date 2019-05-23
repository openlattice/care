// @flow

import React, { Component } from 'react';
import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { Search, PersonResult } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import { resultLabels, searchFields } from './constants';
import { ContentWrapper } from '../../components/layout';
import { searchPeople } from './PeopleActions';
import { REPORT_VIEW_PATH, REPORT_ID_PATH } from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';
import type { RoutingAction } from '../../core/router/RoutingActions';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  actions :{
    searchPeople :RequestSequence;
    goToPath :(path :string) => RoutingAction;
  };
  searchResults :List<Map>;
  fetchState :RequestState;
}

class NewSearchPeopleContainer extends Component<Props> {

  handleOnSearch = (searchValues :Map) => {
    const { actions } = this.props;
    actions.searchPeople(searchValues);
  }

  handleResultClick = (result :Map) => {
    const { actions } = this.props;
    const reportEKID = result.get(OPENLATTICE_ID_FQN);
    actions.goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID));
  }

  render() {
    const { fetchState } = this.props;
    return (
      <ContentWrapper>
        <Search
            isLoading={fetchState === RequestStates.PENDING}
            onSearch={this.handleOnSearch}
            resultComponent={PersonResult}
            resultLabels={resultLabels}
            searchFields={searchFields}
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
    goToPath
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(NewSearchPeopleContainer);
