// @flow

import React, { Component } from 'react';
// import styled from 'styled-components';
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

type Props = {
  actions :{
    getReportsByDateRange :RequestSequence;
  };
  searchResults :List<Map>;
  fetchState :RequestState;
}

class SearchReports extends Component<Props> {

  componentDidMount() {

  }

  handleOnSearch = (searchValues :Map) => {
    const { actions } = this.props;
    actions.getReportsByDateRange(searchValues);
  }

  render() {
    const { fetchState, searchResults } = this.props;
    return (
      <ContentWrapper>
        <Search
            isLoading={fetchState === RequestStates.IS_REQUESTING}
            onSearch={this.handleOnSearch}
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
    getReportsByDateRange
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(SearchReports);
