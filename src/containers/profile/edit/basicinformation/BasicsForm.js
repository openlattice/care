// @flow
import React, { Component } from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import {
  Card,
  CardHeader,
  CardSegment,
  Spinner
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import {
  updateBasics,
} from './actions/BasicInformationActions';
import { schema, uiSchema } from './schemas/BasicInformationSchemas';

type Props = {
  actions :{
    updateBasics :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  propertyTypeIds :Map;
};

type State = {
  formData :Object;
  prepopulated :boolean;
};

class BasicInformationForm extends Component<Props, State> {

  state = {
    formData: {},
    prepopulated: false
  }

  componentDidMount() {
    this.initializeFormData();
  }

  componentDidUpdate(prevProps :Props) {
    const { formData } = this.props;
    const { formData: prevFormData } = prevProps;

    if (!formData.equals(prevFormData)) {
      this.initializeFormData();
    }
  }

  initializeFormData = () => {
    const { formData } = this.props;
    this.setState({
      formData: formData.toJS(),
      prepopulated: !formData.isEmpty()
    });
  }

  handleUpdate = (params) => {
    const { actions, entityIndexToIdMap } = this.props;
    actions.updateBasics({
      ...params,
      entityIndexToIdMap,
    });
  }

  render() {
    const {
      entityIndexToIdMap,
      entitySetIds,
      fetchState,
      propertyTypeIds,
    } = this.props;
    const { formData, prepopulated } = this.state;
    const formContext = {
      editAction: this.handleUpdate,
      entityIndexToIdMap,
      entitySetIds,
      mappers: {},
      propertyTypeIds,
    };

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
          Basics
        </CardHeader>
        <Form
            disabled={prepopulated}
            formContext={formContext}
            formData={formData}
            schema={schema}
            uiSchema={uiSchema} />
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  entityIndexToIdMap: state.getIn(['profile', 'basicInformation', 'basics', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'basicInformation', 'basics', 'fetchState'], RequestStates.STANDBY),
  formData: state.getIn(['profile', 'basicInformation', 'basics', 'formData'], Map()),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updateBasics,
  }, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BasicInformationForm)
);
