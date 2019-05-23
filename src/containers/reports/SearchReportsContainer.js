// @flow

import React, { Component } from 'react';
import { Constants } from 'lattice';
import { List, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Search } from 'lattice-ui-kit';
import type { Dispatch } from 'redux';

import ReportResult from './ReportResult';
import RequestStates from '../../utils/constants/RequestStates';
import type { RequestState } from '../../utils/constants/RequestStates';

import { reportLabels, reportSearchFields } from './constants';
import { ContentWrapper } from '../../components/layout';
import { getReportsByDateRange } from './ReportsActions';
import { REPORT_VIEW_PATH, REPORT_ID_PATH } from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';
import type { RoutingAction } from '../../core/router/RoutingActions';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  actions :{
    getReportsByDateRange :RequestSequence;
    goToPath :(path :string) => RoutingAction;
  };
  searchResults :List<Map>;
  fetchState :RequestState;
}

class SearchReportsContainer extends Component<Props> {

  handleOnSearch = (searchValues :Map) => {
    const { actions } = this.props;
    actions.getReportsByDateRange(searchValues);
  }

  handleResultClick = (result :Map) => {
    const { actions } = this.props;
    const reportEKID = result.get(OPENLATTICE_ID_FQN);
    actions.goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID));
  }

  render() {
    const { fetchState, searchResults } = this.props;
    return (
      <ContentWrapper>
        <Search
            isLoading={fetchState === RequestStates.IS_REQUESTING}
            onSearch={this.handleOnSearch}
            onResultClick={this.handleResultClick}
            resultLabels={reportLabels}
            resultComponent={ReportResult}
            searchFields={reportSearchFields}
            searchResults={searchResults}
            title="Search Reports" />
      </ContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  searchResults: state.getIn(['reports', 'reportsByDateRange'], List()),
  fetchState: state.getIn(['reports', 'fetchState'])
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getReportsByDateRange,
    goToPath
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(SearchReportsContainer);
