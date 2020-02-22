// @flow
import merge from 'lodash/merge';

type ReviewSchemas = {|
  schema :{
    properties :Object
  };
  uiSchema :Object;
|}

const mergeSchemas = (prevSchemas :ReviewSchemas, newSchemas :ReviewSchemas) :ReviewSchemas => {
  const { schema, uiSchema } = newSchemas;
  const { schema: prevSchema = {}, uiSchema: prevUiSchema = {} } = prevSchemas;

  const reviewOrder = {
    'ui:disabled': true,
    'ui:readonly': true,
  };

  return {
    schema: merge(prevSchema, schema),
    uiSchema: merge(prevUiSchema, uiSchema, reviewOrder)
  };
};

// eslint-disable-next-line import/prefer-default-export
export { mergeSchemas };
