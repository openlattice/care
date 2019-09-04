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
import { schema, uiSchema } from './AboutSchemas';

type Props = {
  actions :{
    getResponsibleUser :RequestSequence;
  };
  fetchState :RequestState;
  match :Match;
};

const AboutForm = (props :Props) => {
  const { fetchState } = props;
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

const mapStateToProps = (state :Map) => ({
  fetchState: state.getIn(['profile', 'about', 'fetchState'], RequestStates.STANDBY)
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getResponsibleUser
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AboutForm);
