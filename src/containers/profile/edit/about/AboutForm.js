// @flow

import React, { useEffect, useState } from 'react';
import { Form } from 'lattice-fabricate';
import {
  Select,
  Card,
  CardSegment,
  CardHeader
} from 'lattice-ui-kit';

import { List, Map, get } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { Match } from 'react-router';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import { getResponsibleUser } from './AboutActions';
import { getResponsibleUserOptions } from '../../../staff/StaffActions';
import { schema, uiSchema } from './AboutSchemas';
import { reduceRequestStates } from '../../../../utils/StateUtils';

type Props = {
  actions :{
    getResponsibleUser :RequestSequence;
    getResponsibleUserOptions :RequestSequence;
  };
  fetchState :RequestState;
  match :Match;
};

const AboutForm = (props :Props) => {
  const { actions, fetchState } = props;

  useEffect(() => {
    actions.getResponsibleUserOptions();
  });

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
    fetchState
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getResponsibleUserOptions
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AboutForm);
