// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { Map, List, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import type { Match } from 'react-router';

import Spinner from '../../components/spinner/Spinner';
import ProgressSidebar from '../../components/form/ProgressSidebar';
import { getReportNeighbors } from './ReportsActions';
import { getReportESId } from '../../utils/AppUtils';
import { REPORT_ID_PARAM } from '../../core/router/Routes';
import { MEDIA_QUERY_MD, MEDIA_QUERY_LG } from '../../core/style/Sizes';

const CrisisTemplateWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin: 0;
  width: 100%;
  max-width: 65vw;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 10px;
    max-width: 100%;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    padding: 15px;
  }
`;

const FormWrapper = styled.div`
  padding: 5px;
  width: 100%;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 10px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    padding: 15px;
  }
`;

type OwnProps = {
  match :Match;
}

type Props = {
  actions :{
    getReportNeighbors :RequestSequence;
  };
  entityKeyId :UUID;
  entitySetId :UUID;
  isFetchingReport :boolean;
} & OwnProps;

class CrisisReportView extends Component <Props> {

  componentDidMount() {
    const {
      actions,
      entityKeyId,
      entitySetId
    } = this.props;

    actions.getReportNeighbors({ entityKeyId, entitySetId });
  }

  render() {
    const { isFetchingReport } = this.props;
    if (isFetchingReport) {
      return <Spinner />;
    }
    return (
      <CrisisTemplateWrapper>
        <ProgressSidebar
            formTitle="Crisis Template Report"
            steps={[{
              title: 'testing',
              status: 'complete',
              onClick: () => {},
              disabled: false,
            }]}
            currentStepNumber={0} />
        <PageWrapper>
          <FormWrapper>
            <div>testing</div>
          </FormWrapper>
        </PageWrapper>
      </CrisisTemplateWrapper>
    );
  }
}

const mapStateToProps = (state :Map, ownProps :OwnProps) :Object => {

  const { match } = ownProps;
  const entityKeyId :UUID = match.params[REPORT_ID_PARAM.substr(1)];

  const app :Map = state.get('app');
  const entitySetId :UUID = getReportESId(app);

  return {
    entityKeyId,
    entitySetId,
    isFetchingReport: state.getIn(['reports', 'isFetchingReport'])
  };
};

const mapDispatchToProps = (dispatch :Dispatch<*>) => ({
  // $FlowFixMe RequestSequence is read-only
  actions: bindActionCreators({
    getReportNeighbors
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(CrisisReportView);
