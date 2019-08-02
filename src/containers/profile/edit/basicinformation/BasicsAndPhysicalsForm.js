// @flow
import React, { Component } from 'react';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import { Card, CardSegment, Spinner } from 'lattice-ui-kit';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import { withRouter } from 'react-router-dom';
import type { Dispatch } from 'redux';
import type { Match } from 'react-router-dom';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';
import { schema, uiSchema } from './schemas/BasicsAndPhysicalSchemas';
import { getBasicsAndPhysicals, updateBasicsAndPhysicals } from './BasicInformationActions';

const {
  getPageSectionKey,
  getEntityAddressKey,
  processEntityData,
  processAssociationEntityData
} = DataProcessingUtils;

type Props = {
  actions :{
    getBasicsAndPhysicals :RequestSequence;
    updateBasicsAndPhysicals :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  match :Match;
  propertyTypeIds :Map;
};

type State = {
  formData :Object;
  prepopulated :boolean;
};

class BasicsAndPhysicalsForm extends Component<Props, State> {

  state = {
    formData: {},
    prepopulated: false
  }

  componentDidMount() {
    const { actions, formData, match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    if (formData.isEmpty()) {
      actions.getBasicsAndPhysicals(personEKID);
    }
    else {
      this.initializeFormData();
    }
  }

  componentDidUpdate(prevProps :Props) {
    const {
      actions,
      formData,
      match,
    } = this.props;
    const {
      formData: prevFormData,
      match: prevMatch,
    } = prevProps;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const prevPersonEKID = prevMatch.params[PROFILE_ID_PARAM];
    if (personEKID !== prevPersonEKID) {
      actions.getBasicsAndPhysicals(personEKID);
    }

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

  render() {
    const {
      actions,
      entityIndexToIdMap,
      entitySetIds,
      fetchState,
      propertyTypeIds,
    } = this.props;
    const { formData, prepopulated } = this.state;
    const formContext = {
      editAction: actions.updateBasicsAndPhysicals,
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
      <Form
          formData={formData}
          disabled={prepopulated}
          schema={schema}
          uiSchema={uiSchema}
          formContext={formContext} />
    );
  }
}

const mapStateToProps = state => ({
  entityIndexToIdMap: state.getIn(['profile', 'basicsAndPhysicals', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'basicsAndPhysicals', 'fetchState'], RequestStates.STANDBY),
  formData: state.getIn(['profile', 'basicsAndPhysicals', 'formData'], Map()),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getBasicsAndPhysicals,
    updateBasicsAndPhysicals,
  }, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BasicsAndPhysicalsForm)
);
