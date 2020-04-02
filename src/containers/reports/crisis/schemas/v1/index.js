import { schema as behaviorSchema, uiSchema as behaviorUiSchema } from './BehaviorSchemas';
import { schema as dispositionSchema, uiSchema as dispositionUiSchema } from './DispositionSchemas';
import { schema as incidentSchema, uiSchema as incidentUiSchema } from './IncidentSchemas';
import { schema as natureOfCrisisSchema, uiSchema as natureOfCrisisUiSchema } from './NatureOfCrisisSchemas';
import { schema as officerSafetySchema, uiSchema as officerSafetyUiSchema } from './OfficerSafetySchemas';

const schemas = [
  incidentSchema,
  behaviorSchema,
  natureOfCrisisSchema,
  officerSafetySchema,
  dispositionSchema
];

const uiSchemas = [
  incidentUiSchema,
  behaviorUiSchema,
  natureOfCrisisUiSchema,
  officerSafetyUiSchema,
  dispositionUiSchema
];

const v1 = {
  schemas,
  uiSchemas,
};

export default v1;
