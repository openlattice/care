import { schema as behaviorSchema, uiSchema as behaviorUiSchema } from './BehaviorSchemas';
import { schema as incidentSchema, uiSchema as incidentUiSchema } from './IncidentSchemas';
import { schema as natureOfCrisisSchema, uiSchema as natureOfCrisisUiSchema } from './NatureOfCrisisSchemas';

const schemas = [
  incidentSchema,
  behaviorSchema,
  natureOfCrisisSchema,
];

const uiSchemas = [
  incidentUiSchema,
  behaviorUiSchema,
  natureOfCrisisUiSchema
];

const v1 = {
  schemas,
  uiSchemas,
};

export default v1;
