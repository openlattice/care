// @flow
import React, { Component } from 'react';
import { Form } from 'lattice-fabricate';
import { schema, uiSchema } from './schemas/ResponsePlanSchemas';

// const {
//   processEntityData,
//   processAssociationEntityData
// } = DataProcessingUtils;

type Props = {
  
};

class EditResponsePlan extends Component<Props> {

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
