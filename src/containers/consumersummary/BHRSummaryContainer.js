import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, fromJS, toJS } from 'immutable';

import ReviewView from '../../components/ReviewView';
import { getBHRReport } from './ConsumerSummaryActionFactory';
import { REQUEST_STATUSES } from './ConsumerSummaryReducer';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const {
  BEHAVIORAL_HEALTH_REPORT_FQN
} = APP_TYPES_FQNS;


class bhrFormSummaryContainer extends React.Component {
  componentWillMount() {
    console.log('selectedReport:', this.props.selectedReport);
    this.props.actions.getBHRReport({
      entitySetId: this.props.bhrEntitySetId,
      entityId: this.props.selectedReport.get('neighborId')
    });
  }

  render() {
    const {
      reportInfo,
      consumerInfo,
      complainantInfo,
      dispositionInfo,
      officerInfo
    } = this.props.formData;

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

  const formData = state.getIn([
    'consumerSummary',
    'formData'
  ], new Map());

  console.log('FORM DATA in mapStateToProps:', formData.toJS());

  return {
    bhrEntitySetId,
    submissionState,
    formData
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ getBHRReport }, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(bhrFormSummaryContainer)
);