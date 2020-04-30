import { schema as behaviorSchema, uiSchema as behaviorUiSchema } from './BehaviorSchemas';
import { schema as clinicianBehaviorSchema, uiSchema as clinicianBehaviorUiSchema } from './ClinicianBehaviorSchemas';
import {
  schema as clinicianDispositionSchema,
  uiSchema as clinicianDispositionUiSchema
} from './ClinicianDispositionSchemas';
import {
  schema as dispositionSchema,
  uiSchema as dispositionUiSchema
} from './DispositionSchemas';
import {
  schema as housingAndEmploymentSchema,
  uiSchema as housingAndEmploymentUiSchema
} from './HousingAndEmploymentSchemas';
import { schema as incidentSchema, uiSchema as incidentUiSchema } from './IncidentSchemas';
import { schema as insuranceSchema, uiSchema as insuranceUiSchema } from './InsuranceSchemas';
import { schema as medicalSchema, uiSchema as medicalUiSchema } from './MedicalSchemas';
import { schema as threatSchema, uiSchema as threatUiSchema } from './ThreatSchemas';

// const schemas = [
//   incidentSchema,
//   clinicianBehaviorSchema,
//   medicalSchema,
//   threatSchema,
//   housingAndEmploymentSchema,
//   insuranceSchema,
//   clinicianDispositionSchema,
// ];

// const uiSchemas = [
//   incidentUiSchema,
//   clinicianBehaviorUiSchema,
//   medicalUiSchema,
//   threatUiSchema,
//   housingAndEmploymentUiSchema,
//   insuranceUiSchema,
//   clinicianDispositionUiSchema,
// ];

const schemas = [
  incidentSchema,
  behaviorSchema,
  medicalSchema,
  threatSchema,
  housingAndEmploymentSchema,
  dispositionSchema,
];

const uiSchemas = [
  incidentUiSchema,
  behaviorUiSchema,
  medicalUiSchema,
  threatUiSchema,
  housingAndEmploymentUiSchema,
  dispositionUiSchema,
];


const v2 = {
  schemas,
  uiSchemas
};

export default v2;
