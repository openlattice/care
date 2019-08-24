// @flow
import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import {
  Card,
  CardHeader,
  CardSegment,
  Spinner
} from 'lattice-ui-kit';
import { Constants } from 'lattice';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import {
  updateContact,
  submitContact
} from './ContactsActions';
import { schema, uiSchema } from './schemas/ContactsSchemas';
import { removeRelationshipData, getContactAssociations } from './ContactsUtils';

const { OPENLATTICE_ID_FQN } = Constants;
const {
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;

type Props = {
  actions :{
    submitContact :RequestSequence;
    updateContact :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  personEKID :UUID;
  propertyTypeIds :Map;
  submitState :RequestState;
};

type State = {
  formData :Object;
  prepopulated :boolean;
};

class ContactsForm extends Component<Props, State> {

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

  getAssociations = (formData :Object) => {
    const { personEKID } = this.props;
    const nowAsIsoString :string = DateTime.local().toISO();
    return [
      ...getContactAssociations(
        formData,
        nowAsIsoString,
        personEKID
      )
    ];
  }

  // process associations before removing them from being processed as a regular entity
  handleSubmit = ({
    formData,
    path = [],
    properties
  } :Object) => {
    const { actions, entitySetIds, propertyTypeIds } = this.props;
    const associationEntityData = processAssociationEntityData(
      this.getAssociations(formData),
      entitySetIds,
      propertyTypeIds
    );

    const withoutRelationships = removeRelationshipData(formData);
    const entityData = processEntityData(withoutRelationships, entitySetIds, propertyTypeIds);

    actions.submitContact({
      associationEntityData,
      entityData,
      path,
      properties: properties || formData
    });
  }

  handleChange = ({ formData } :Object) => {
    this.setState({ formData });
  }

  render() {
    const {
      actions,
      entityIndexToIdMap,
      entitySetIds,
      fetchState,
      propertyTypeIds,
      submitState,
    } = this.props;
    const { formData, prepopulated } = this.state;
    const formContext = {
      addActions: {
        addContact: this.handleSubmit
      },
      deleteAction: () => {},
      editAction: actions.updateContact,
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
          Emergency Contacts
        </CardHeader>
        <Form
            disabled={prepopulated}
            formContext={formContext}
            formData={formData}
            isSubmitting={submitState === RequestStates.PENDING}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            schema={schema}
            uiSchema={uiSchema} />
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  entityIndexToIdMap: state.getIn(['profile', 'basicInformation', 'address', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'basicInformation', 'address', 'fetchState'], RequestStates.STANDBY),
  formData: state.getIn(['profile', 'basicInformation', 'address', 'formData'], Map()),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  submitState: state.getIn(['profile', 'basicInformation', 'address', 'submitState'], RequestStates.STANDBY),
  personEKID: state.getIn(['profile', 'basicInformation', 'basics', 'data', OPENLATTICE_ID_FQN, 0])
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updateContact,
    submitContact,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(ContactsForm);
