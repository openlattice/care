// @flow
import merge from 'lodash/merge';

import Logger from '../../../../utils/Logger';

const LOG = new Logger('schemaUtils');

type ReviewSchemas = {|
  schema :Object;
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


// Merges all schemas and uiSchemas together into a single disabled, readonly pair of schemas.
// issues warning if schemas and uiSchemas have mismatching lengths
const generateReviewSchema = (schemas :Object[], uiSchemas :Object[]) => {
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

  return reviewSchemas;
};

export { generateReviewSchema, mergeSchemas };
