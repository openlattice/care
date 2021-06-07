// @flow
import React, { Component } from 'react';

import { List, Map, get } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import {
  Card,
  CardHeader,
  CardSegment,
  Spinner
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Match } from 'react-router';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import {
  deleteEmergencyContact,
  getEmergencyContacts,
  submitEmergencyContacts,
  updateEmergencyContact,
} from './EmergencyContactsActions';
import { getContactAssociations, removeRelationshipData } from './EmergencyContactsUtils';
import { schema, uiSchema } from './schemas/EmergencyContactsSchemas';

import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';

const {
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;

type Props = {
  actions :{
    getEmergencyContacts :RequestSequence;
    deleteEmergencyContact :RequestSequence;
    submitEmergencyContacts :RequestSequence;
    updateEmergencyContact :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  match :Match;
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
    const {
      actions,
      match,
    } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    actions.getEmergencyContacts(personEKID);
    this.initializeFormData();
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
      actions.getEmergencyContacts(personEKID);
    }

    if (!formData.equals(prevFormData)) {
      this.initializeFormData();
    }
  }

  initializeFormData = () => {
    const { formData } = this.props;
    this.setState({
      formData: formData.toJS(),
      prepopulated: !get(formData, getPageSectionKey(1, 1), List()).isEmpty()
    });
  }

  getAssociations = (formData :Object) :any[][] => {
    const { match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM] || '';
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

    actions.submitEmergencyContacts({
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
      deleteAction: actions.deleteEmergencyContact,
      editAction: actions.updateEmergencyContact,
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

const mapStateToProps = (state) => ({
  entityIndexToIdMap: state.getIn(['profile', 'emergencyContacts', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'emergencyContacts', 'fetchState'], RequestStates.STANDBY),
  formData: state.getIn(['profile', 'emergencyContacts', 'formData'], Map()),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  submitState: state.getIn(['profile', 'emergencyContacts', 'submitState'], RequestStates.STANDBY),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getEmergencyContacts,
    deleteEmergencyContact,
    submitEmergencyContacts,
    updateEmergencyContact,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(ContactsForm);
