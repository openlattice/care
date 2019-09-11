// @flow

import React, { useEffect, useState } from 'react';
import { Form } from 'lattice-fabricate';
import {
  Card,
  CardSegment,
  CardHeader,
  Spinner,
} from 'lattice-ui-kit';

import { List, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
// import type { Match } from 'react-router';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import { getResponsibleUser, getAboutPlan } from './AboutActions';
import { getResponsibleUserOptions } from '../../../staff/StaffActions';
import { schema, uiSchema } from './AboutSchemas';
import { reduceRequestStates } from '../../../../utils/StateUtils';

type Props = {
  actions :{
    getResponsibleUser :RequestSequence;
    getResponsibleUserOptions :RequestSequence;
  };
  fetchState :RequestState;
  responsibleUsers :List;
};

const AboutForm = (props :Props) => {
  const { actions, fetchState, responsibleUsers } = props;

  useEffect(() => {
    actions.getResponsibleUserOptions();
  }, []);

  useEffect(() => {
    console.log('got new users', formData);
    debugger;
  }, [formData]);

  if (fetchState === RequestStates.PENDING) {
    return (
      <Card>
        <CardSegment vertical>
          <Spinner size="2x" />
        </CardSegment>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        About Plan
      </CardHeader>
      <Form
          // disabled
          // formContext
          // formData
          // isSubmitting
          // onChange
          // onSubmit
          schema={schema}
          uiSchema={uiSchema} />
    </Card>
  );
};

const mapStateToProps = (state :Map) => {

  const fetchState = reduceRequestStates([
    state.getIn(['profile', 'about', 'fetchState'], RequestStates.STANDBY),
    state.getIn(['staff', 'responsibleUsers', 'fetchState'], RequestStates.STANDBY)
  ]);

  return {
    fetchState,
    responsibleUsers: state.getIn(['staff', 'responsibleUsers', 'data'], List()),
    formData: state.getIn(['staff', 'about', 'formData'], Map())
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getResponsibleUserOptions,
    getAboutPlan,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AboutForm);
