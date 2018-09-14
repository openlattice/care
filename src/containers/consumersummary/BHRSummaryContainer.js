import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, fromJS, toJS } from 'immutable';

import ReviewView from '../../components/ReviewView';
import { getBHRReportData } from './ConsumerSummaryActionFactory';
import { REQUEST_STATUSES } from './ConsumerSummaryReducer';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const {
  BEHAVIORAL_HEALTH_REPORT_FQN
} = APP_TYPES_FQNS;


class bhrFormSummaryContainer extends React.Component {
  componentWillMount() {
    console.log('selectedreport props:', this.props.selectedReport.toJS());
    this.props.actions.getBHRReportData({
      entitySetId: this.props.bhrEntitySetId,
      entityId: this.props.selectedReport.getIn(['openlattice.@id', 0])
    });
  }

  render() {
    console.log('render reportData:', this.props.reportData.toJS())

    return (
      <div>SUMMARY VIEW</div>
    );
  }
};

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganization']);

  const bhrEntitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  const submissionState :number = state.getIn([
    'consumerSummary',
    'submissionState'
  ]);

  const reportData = state.getIn([
    'consumerSummary',
    'reportData'
  ], new Map());

  console.log('FORM DATA:', reportData.toJS());

  return {
    bhrEntitySetId,
    submissionState,
    reportData
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ getBHRReportData }, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(bhrFormSummaryContainer)
);