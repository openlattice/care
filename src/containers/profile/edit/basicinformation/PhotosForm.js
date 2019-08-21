// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import {
  Card,
  CardHeader,
  CardSegment,
  Spinner
} from 'lattice-ui-kit';
import { Map, updateIn, getIn } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import Portrait from '../../../../components/portrait/Portrait';
import { updatePhoto, submitPhotos } from './actions/PhotosActions';
import { removeDataUriPrefix, getImageDataFromEntity } from '../../../../utils/BinaryUtils';
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

const mappers = {
  [VALUE_MAPPERS]: {
    [getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)]: signatureValueMapper
  }
};

const PortraitWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px 30px 0 30px;
`;

type Props = {
  actions :{
    submitPhotos :RequestSequence;
    updatePhoto :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  imageURL :string;
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
    const { entityIndexToIdMap } = this.props;
    const { entityIndexToIdMap: prevEntityIndexToIdMap } = prevProps;

    if (!entityIndexToIdMap.equals(prevEntityIndexToIdMap)) {
      this.initializeFormData();
    }
  }

  initializeFormData = () => {
    const { entityIndexToIdMap } = this.props;
    this.setState({
      prepopulated: !entityIndexToIdMap.isEmpty()
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

  handleOnChange = ({ formData } :any) => {
    this.setState({ formData });
  }

  render() {
    const {
      actions,
      entityIndexToIdMap,
      entitySetIds,
      fetchState,
      imageURL,
      propertyTypeIds,
    } = this.props;
    const { formData, prepopulated } = this.state;

    const formContext = {
      editAction: actions.updatePhoto,
      entityIndexToIdMap,
      entitySetIds,
      mappers,
      propertyTypeIds,
    };

    const previewImageURL = getIn(formData,
      [
        getPageSectionKey(1, 1),
        getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)
      ]) || imageURL;

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
          Profile Picture
        </CardHeader>
        <PortraitWrapper>
          <Portrait imageUrl={previewImageURL} />
        </PortraitWrapper>
        <Form
            formData={formData}
            disabled={prepopulated}
            schema={schema}
            onChange={this.handleOnChange}
            uiSchema={uiSchema}
            onSubmit={this.handleSubmit}
            formContext={formContext} />
      </Card>
    );
  }
}

const mapStateToProps = (state) => {

  const imageEntity = state.getIn(['profile', 'basicInformation', 'photos', 'data'], Map());
  const imageURL = getImageDataFromEntity(imageEntity);

  return {
    entityIndexToIdMap: state.getIn(['profile', 'basicInformation', 'photos', 'entityIndexToIdMap'], Map()),
    entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
    fetchState: state.getIn(['profile', 'basicInformation', 'photos', 'fetchState'], RequestStates.STANDBY),
    formData: state.getIn(['profile', 'basicInformation', 'photos', 'formData'], Map()),
    imageURL,
    propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updatePhoto,
    submitPhotos,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AddressForm);
