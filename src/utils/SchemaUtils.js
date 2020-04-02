// @flow
import merge from 'lodash/merge';

import Logger from './Logger';

const LOG = new Logger('schemaUtils');

type ReviewSchemas = {|
  schema :Object;
  uiSchema :Object;
|}

const mergeSchemas = (prevSchemas :ReviewSchemas, newSchemas :ReviewSchemas) :ReviewSchemas => {
  const { schema, uiSchema } = newSchemas;
  const { schema: prevSchema = {}, uiSchema: prevUiSchema = {} } = prevSchemas;

  return {
    schema: merge(prevSchema, schema),
    uiSchema: merge(prevUiSchema, uiSchema)
  };
};

// Merges all schemas and uiSchemas together into a single disabled, readonly pair of schemas.
// issues warning if schemas and uiSchemas have mismatching lengths
const generateReviewSchema = (schemas :Object[], uiSchemas :Object[], readOnly :boolean = false) => {
  const reviewSchemas = {
    schema: {},
    uiSchema: {}
  };

  if (schemas.length !== uiSchemas.length) {
    LOG.warn('generateReviewSchema', 'schemas and uiSchemas have mismatching lengths');
  }

  schemas.forEach((schema, idx) => {
    mergeSchemas(reviewSchemas, {
      schema: schemas[idx],
      uiSchema: uiSchemas[idx]
    });
  });

  if (readOnly) {
    merge(reviewSchemas.uiSchema, {
      'ui:disabled': true,
      'ui:readonly': true,
    });
  }

  return reviewSchemas;
};

export { generateReviewSchema, mergeSchemas };
