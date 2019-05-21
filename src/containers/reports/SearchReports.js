// @flow

import React, { Component } from 'react';
// import styled from 'styled-components';
import { List, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Search } from 'lattice-ui-kit';
import type { Dispatch } from 'redux';

import RequestStates from '../../utils/constants/RequestStates';
import type { RequestState } from '../../utils/constants/RequestState';

import { reportLabels, reportSearchFields } from './constants';
import { ContentContainerInnerWrapper } from '../../components/layout';
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
    console.log(searchValues);
    const { actions } = this.props;
    actions.getReportsByDateRange();
  }

  render() {
    const { fetchState } = this.props;
    return (
      <ContentContainerInnerWrapper>
        <Search
            isLoading={fetchState === RequestStates.IS_REQUESTING}
            onSearch={this.handleOnSearch}
            searchFields={reportSearchFields}
            title="Search Reports" />
      </ContentContainerInnerWrapper>
    );
  }
}

const mapStateToProps = state => ({
  searchResults: state.getIn(['reports', 'reports'], List()),
  fetchState: state.getIn(['reports', 'fetchState'])
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getReportsByDateRange
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(SearchReports);
