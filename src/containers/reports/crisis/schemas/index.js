import { schema as behaviorSchema, uiSchema as behaviorUiSchema } from './BehaviorSchemas';
import { schema as dispositionSchema, uiSchema as dispositionUiSchema } from './DispositionSchemas';
import {
  schema as housingAndEmploymentSchema,
  uiSchema as housingAndEmploymentUiSchema
} from './HousingAndEmploymentSchemas';
import { schema as incidentSchema, uiSchema as incidentUiSchema } from './IncidentSchemas';
import { schema as insuranceSchema, uiSchema as insuranceUiSchema } from './InsuranceSchemas';
import { schema as medicalSchema, uiSchema as medicalUiSchema } from './MedicalSchemas';
import { schema as threatSchema, uiSchema as threatUiSchema } from './ThreatSchemas';

const schemas = [
  incidentSchema,
  behaviorSchema,
  medicalSchema,
  threatSchema,
  housingAndEmploymentSchema,
  insuranceSchema,
  dispositionSchema,
];

const uiSchemas = [
  incidentUiSchema,
  behaviorUiSchema,
  medicalUiSchema,
  threatUiSchema,
  housingAndEmploymentUiSchema,
  insuranceUiSchema,
  dispositionUiSchema,
];

const xSchemas = {
  incident: incidentSchema,
  behavior: behaviorSchema,
  medical: medicalSchema,
  threat: threatSchema,
  housingAndEmployment: housingAndEmploymentSchema,
  insurance: insuranceSchema,
  disposition: dispositionSchema,
};

const xUiSchemas = {
  incident: incidentUiSchema,
  behavior: behaviorUiSchema,
  medical: medicalUiSchema,
  threat: threatUiSchema,
  housingAndEmployment: housingAndEmploymentUiSchema,
  insurance: insuranceUiSchema,
  disposition: dispositionUiSchema,
};

export {
  schemas,
  uiSchemas,
  xSchemas,
  xUiSchemas,
};
