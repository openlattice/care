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
import { Map, updateIn } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import {
  updatePhoto,
  submitPhotos
} from './actions/PhotosActions';
import { removeDataUriPrefix } from '../../../../utils/BinaryUtils';
import { schema, uiSchema } from './schemas/PhotosSchemas';
import { COMPLETED_DT_FQN, IMAGE_DATA_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const {
  IMAGE_FQN,
  IS_PICTURE_OF_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const {
  processEntityData,
  processAssociationEntityData,
  getPageSectionKey,
  getEntityAddressKey,
  VALUE_MAPPERS,
} = DataProcessingUtils;

const signatureValueMapper = (value :any, contentType :string = 'image/png') => ({
  data: value,
  'content-type': contentType,
});

type Props = {
  actions :{
    submitPhotos :RequestSequence;
    updatePhoto :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  personEKID :UUID;
  propertyTypeIds :Map;
};

type State = {
  formData :Object;
  prepopulated :boolean;
};

class AddressForm extends Component<Props, State> {

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

  getAssociations = () => {
    const { personEKID } = this.props;
    const nowAsIsoString :string = DateTime.local().toISO();
    return [
      [IS_PICTURE_OF_FQN, 0, IMAGE_FQN, personEKID, PEOPLE_FQN, {
        [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
      }],
    ];
  }

  handleSubmit = ({ formData } :Object) => {
    const { actions, entitySetIds, propertyTypeIds } = this.props;

    const noDataUriFormData = updateIn(
      formData,
      [getPageSectionKey(1, 1), getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)],
      removeDataUriPrefix
    );

    const mappers = {
      [VALUE_MAPPERS]: {
        [getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)]: signatureValueMapper
      }
    };

    const entityData = processEntityData(noDataUriFormData, entitySetIds, propertyTypeIds, mappers);
    const associationEntityData = processAssociationEntityData(
      this.getAssociations(),
      entitySetIds,
      propertyTypeIds
    );

    actions.submitPhotos({
      associationEntityData,
      entityData,
      path: [],
      properties: formData
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

    const mappers = {
      [VALUE_MAPPERS]: {
        [getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)]: signatureValueMapper
      }
    };

    const formContext = {
      editAction: actions.updatePhoto,
      entityIndexToIdMap,
      entitySetIds,
      mappers,
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
        <CardHeader id="profile-picture" mode="primary" padding="sm">
          Profile Picture
        </CardHeader>
        <Form
            formData={formData}
            disabled={prepopulated}
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={this.handleSubmit}
            formContext={formContext} />
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  entityIndexToIdMap: state.getIn(['profile', 'basicInformation', 'photos', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'basicInformation', 'photos', 'fetchState'], RequestStates.STANDBY),
  formData: state.getIn(['profile', 'basicInformation', 'photos', 'formData'], Map()),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updatePhoto,
    submitPhotos,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AddressForm);
