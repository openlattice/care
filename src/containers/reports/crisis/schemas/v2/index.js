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

const clinicianSchemas = [
  incidentSchema,
  clinicianBehaviorSchema,
  medicalSchema,
  threatSchema,
  housingAndEmploymentSchema,
  insuranceSchema,
  clinicianDispositionSchema,
];

const clinicianUiSchemas = [
  incidentUiSchema,
  clinicianBehaviorUiSchema,
  medicalUiSchema,
  threatUiSchema,
  housingAndEmploymentUiSchema,
  insuranceUiSchema,
  clinicianDispositionUiSchema,
];

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
  officer: {
    schemas,
    uiSchemas,
  },
  clinician: {
    schemas: clinicianSchemas,
    uiSchemas: clinicianUiSchemas,
  }
};

export default v2;
