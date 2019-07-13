import React, { Component } from 'react';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import { schema, uiSchema } from './schemas/ResponsePlanSchemas';

const {
  processEntityData,
  processAssociationEntityData
} = DataProcessingUtils;

class EditResponsePlan extends Component {


  render() {
    return (
      <Form
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={this.handleSubmit} />
    );
  }
}

export default EditResponsePlan;
