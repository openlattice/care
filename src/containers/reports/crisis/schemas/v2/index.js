import { schema as assistanceSchema, uiSchema as assistanceUiSchema } from './AssistanceOnSceneSchemas';
import { schema as behaviorSchema, uiSchema as behaviorUiSchema } from './BehaviorSchemas';
import { schema as clinicianBehaviorSchema, uiSchema as clinicianBehaviorUiSchema } from './ClinicianBehaviorSchemas';
import {
  schema as clinicianDispositionSchema,
  uiSchema as clinicianDispositionUiSchema
} from './ClinicianDispositionSchemas';
import {
  schema as clinicianMedicalSchema,
  uiSchema as clinicianMedicalUiSchema
} from './ClinicianMedicalSchemas';
import {
  schema as clinicianThreatSchema,
  uiSchema as clinicianThreatUiSchema
} from './ClinicianThreatSchemas';
import {
  schema as dispositionSchema,
  uiSchema as dispositionUiSchema
} from './DispositionSchemas';
import { schema as backgroundSchema, uiSchema as backgroundUiSchema } from './FollowupBackgroundSchemas';
import { schema as substancesSchema, uiSchema as substancesUiSchema } from './FollowupSubstancesSchemas';
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
  clinicianMedicalSchema,
  clinicianThreatSchema,
  housingAndEmploymentSchema,
  insuranceSchema,
  clinicianDispositionSchema,
];

const clinicianUiSchemas = [
  incidentUiSchema,
  clinicianBehaviorUiSchema,
  clinicianMedicalUiSchema,
  clinicianThreatUiSchema,
  housingAndEmploymentUiSchema,
  insuranceUiSchema,
  clinicianDispositionUiSchema,
];

const schemas = [
  incidentSchema,
  behaviorSchema,
  medicalSchema,
  threatSchema,
  assistanceSchema,
  housingAndEmploymentSchema,
  dispositionSchema,
];

const uiSchemas = [
  incidentUiSchema,
  behaviorUiSchema,
  medicalUiSchema,
  threatUiSchema,
  assistanceUiSchema,
  housingAndEmploymentUiSchema,
  dispositionUiSchema,
];

const followupSchemas = [
  backgroundSchema,
  substancesSchema,
];

const followupUiSchemas = [
  backgroundUiSchema,
  substancesUiSchema,
];


const v2 = {
  officer: {
    schemas,
    uiSchemas,
  },
  clinician: {
    schemas: clinicianSchemas,
    uiSchemas: clinicianUiSchemas,
  },
  followup: {
    schemas: followupSchemas,
    uiSchemas: followupUiSchemas
  }
};

export default v2;
