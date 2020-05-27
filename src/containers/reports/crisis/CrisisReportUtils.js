// @flow
import {
  List,
  Map,
  fromJS,
  get,
  getIn,
  set,
  setIn,
} from 'immutable';
import { Models } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import {
  ARRESTED,
  ATTEMPT,
  CRIMES_AGAINST_PERSON,
  DISPOSITIONS,
  FELONY,
  HOMELESS_STR,
  NOT_ARRESTED,
  SUICIDE_BEHAVIORS,
  THREAT,
} from './schemas/v1/constants';

import * as FQN from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS as APP } from '../../../shared/Consts';
import { isNonEmptyStringArray } from '../../../utils/LangUtils';

const { FullyQualifiedName } = Models;

const {
  getEntityAddressKey,
  getPageSectionKey,
  parseEntityAddressKey,
} = DataProcessingUtils;

const getDiagnosisAssociations = (
  formData,
  existingEntityKeyIds,
  createdDateTime,
  reportFQN
) => {
  const associations = [];
  const diagnosis = get(formData, getPageSectionKey(4, 1), []);
  const reportIndex = existingEntityKeyIds[reportFQN] || 0;

  const diagnosisFQN = reportFQN === APP.CRISIS_REPORT_FQN ? APP.DIAGNOSIS_FQN : APP.DIAGNOSIS_CLINICIAN_FQN;
  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };

  for (let i = 0; i < diagnosis.length; i += 1) {
    associations.push([
      APP.PART_OF_FQN,
      i,
      diagnosisFQN,
      reportIndex,
      reportFQN,
      NOW_DATA,
    ]);
  }
  return associations;
};

const getMedicationAssociations = (
  formData,
  existingEntityKeyIds,
  createdDateTime,
  reportFQN
) => {
  const associations = [];
  const medications = get(formData, getPageSectionKey(4, 2), []);
  const reportIndex = existingEntityKeyIds[reportFQN] || 0;

  const medicationFQN = reportFQN === APP.CRISIS_REPORT_FQN
    ? APP.MEDICATION_STATEMENT_FQN
    : APP.MEDICATION_STATEMENT_CLINICIAN_FQN;
  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };

  for (let i = 0; i < medications.length; i += 1) {
    associations.push([
      APP.PART_OF_FQN,
      i,
      medicationFQN,
      reportIndex,
      reportFQN,
      NOW_DATA,
    ]);
  }
  return associations;
};

const getOptionalCrisisReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO(),
  reportFQN :FullyQualifiedName,
) :any[][] => {
  const associations = [];

  const diagnosis :any[][] = getDiagnosisAssociations(formData, existingEntityKeyIds, createdDateTime, reportFQN);
  const medications :any[][] = getMedicationAssociations(formData, existingEntityKeyIds, createdDateTime, reportFQN);

  return associations.concat(diagnosis, medications);
};

const getCrisisReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO(),
) :any[][] => {
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];

  const NOW_DATA = { [FQN.DATE_TIME_FQN]: [createdDateTime] };
  const INTERACTED_DATA = {
    [FQN.DATE_TIME_FQN]: [createdDateTime],
  };

  const datetimeKey = getEntityAddressKey(0, APP.BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DATE_TIME_OCCURRED_FQN);
  const datetime = getIn(formData, [getPageSectionKey(1, 1), datetimeKey]);
  if (DateTime.fromISO(datetime).isValid) {
    INTERACTED_DATA[FQN.CONTACT_DATE_TIME_FQN] = [datetime];
  }
  else {
    INTERACTED_DATA[FQN.CONTACT_DATE_TIME_FQN] = [createdDateTime];
  }

  const associations :any[][] = [
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.BEHAVIORAL_HEALTH_REPORT_FQN, NOW_DATA],
    [APP.INTERACTED_WITH_FQN, staffEKID, APP.STAFF_FQN, personEKID, APP.PEOPLE_FQN, INTERACTED_DATA],
    [APP.APPEARS_IN_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.BEHAVIORAL_HEALTH_REPORT_FQN, NOW_DATA],
  ];

  return associations;
};

const getClinicianCrisisReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO()
) :any[][] => {
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];
  const incidentEKID = existingEntityKeyIds[APP.INCIDENT_FQN] || 0;

  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };
  const INVOLVED_IN_DATA = set(NOW_DATA, FQN.ROLE_FQN, ['Report subject']);
  const CLEARED_BY_DATA = { [FQN.DATE_TIME_FQN]: [createdDateTime] };

  // static assocations
  let associations :any[][] = [
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, incidentEKID, APP.INCIDENT_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.BEHAVIOR_CLINICIAN_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SUBSTANCE_CLINICIAN_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 1, APP.SUBSTANCE_CLINICIAN_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.WEAPON_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.VIOLENT_BEHAVIOR_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INJURY_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SELF_HARM_CLINICIAN_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.HOUSING_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.OCCUPATION_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INCOME_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INSURANCE_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 1, APP.INSURANCE_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INTERACTION_STRATEGY_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.DISPOSITION_CLINICIAN_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.ENCOUNTER_DETAILS_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INVOICE_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.REFERRAL_REQUEST_FQN, 0, APP.CRISIS_REPORT_CLINICIAN_FQN, NOW_DATA],

    // analytics
    [APP.OBSERVED_IN_FQN, 0, APP.BEHAVIOR_CLINICIAN_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.OBSERVED_IN_FQN, 0, APP.SUBSTANCE_CLINICIAN_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.OBSERVED_IN_FQN, 1, APP.SUBSTANCE_CLINICIAN_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.OBSERVED_IN_FQN, 0, APP.SELF_HARM_CLINICIAN_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.SUBJECT_OF_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.REFERRAL_REQUEST_FQN, NOW_DATA],
    [APP.REPORTED_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.HOUSING_FQN, NOW_DATA],
    [APP.REPORTED_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.INSURANCE_FQN, NOW_DATA],
    [APP.REPORTED_FQN, personEKID, APP.PEOPLE_FQN, 1, APP.INSURANCE_FQN, NOW_DATA],
    [APP.CLEARED_BY_FQN, incidentEKID, APP.INCIDENT_FQN, 0, APP.DISPOSITION_CLINICIAN_FQN, CLEARED_BY_DATA]

  ];
  // do not duplicate edges
  if (!incidentEKID) {
    associations = associations.concat([
      [APP.INVOLVED_IN_FQN, personEKID, APP.PEOPLE_FQN, incidentEKID, APP.INCIDENT_FQN, INVOLVED_IN_DATA],
      [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, incidentEKID, APP.INCIDENT_FQN, NOW_DATA],
      [APP.LOCATED_AT_FQN, incidentEKID, APP.INCIDENT_FQN, 0, APP.LOCATION_FQN, NOW_DATA],
    ]);
  }

  const optionalAssociations :any[][] = getOptionalCrisisReportAssociations(
    formData,
    existingEntityKeyIds,
    createdDateTime,
    APP.CRISIS_REPORT_CLINICIAN_FQN
  );

  return associations.concat(optionalAssociations);
};

const getOfficerCrisisReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO()
) :any[][] => {
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];
  const incidentEKID = existingEntityKeyIds[APP.INCIDENT_FQN] || 0;

  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };
  const INVOLVED_IN_DATA = set(NOW_DATA, FQN.ROLE_FQN, ['Report subject']);
  const CLEARED_BY_DATA = { [FQN.DATE_TIME_FQN]: [createdDateTime] };

  // static assocations
  let associations :any[][] = [
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, incidentEKID, APP.INCIDENT_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.BEHAVIOR_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SUBSTANCE_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 1, APP.SUBSTANCE_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.WEAPON_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.VIOLENT_BEHAVIOR_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INJURY_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SELF_HARM_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.HOUSING_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.OCCUPATION_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INCOME_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INTERACTION_STRATEGY_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.OFFENSE_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.DISPOSITION_FQN, 0, APP.CRISIS_REPORT_FQN, NOW_DATA],

    // analytics
    [APP.OBSERVED_IN_FQN, 0, APP.BEHAVIOR_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.OBSERVED_IN_FQN, 0, APP.SUBSTANCE_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.OBSERVED_IN_FQN, 1, APP.SUBSTANCE_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.OBSERVED_IN_FQN, 0, APP.SELF_HARM_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.REPORTED_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.HOUSING_FQN, NOW_DATA],
    [APP.CLEARED_BY_FQN, incidentEKID, APP.INCIDENT_FQN, 0, APP.DISPOSITION_FQN, CLEARED_BY_DATA]
  ];

  // do not duplicate edges
  if (!incidentEKID) {
    associations = associations.concat([
      [APP.INVOLVED_IN_FQN, personEKID, APP.PEOPLE_FQN, incidentEKID, APP.INCIDENT_FQN, INVOLVED_IN_DATA],
      [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, incidentEKID, APP.INCIDENT_FQN, NOW_DATA],
      [APP.LOCATED_AT_FQN, incidentEKID, APP.INCIDENT_FQN, 0, APP.LOCATION_FQN, NOW_DATA],
    ]);
  }

  const optionalAssociations :any[][] = getOptionalCrisisReportAssociations(
    formData,
    existingEntityKeyIds,
    createdDateTime,
    APP.CRISIS_REPORT_FQN
  );

  return associations.concat(optionalAssociations);
};

const getFollowupReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO()
) :any[][] => {
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];
  const incidentEKID = existingEntityKeyIds[APP.INCIDENT_FQN];
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];

  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };
  const CLEARED_BY_DATA = { [FQN.DATE_TIME_FQN]: [createdDateTime] };

  // static assocations
  const associations :any[][] = [
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.FOLLOW_UP_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, incidentEKID, APP.INCIDENT_FQN, 0, APP.FOLLOW_UP_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.LOCATION_FQN, 0, APP.FOLLOW_UP_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.REFERRAL_REQUEST_FQN, 0, APP.FOLLOW_UP_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SUBSTANCE_FQN, 0, APP.FOLLOW_UP_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 1, APP.SUBSTANCE_FQN, 0, APP.FOLLOW_UP_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.ENCOUNTER_FQN, 0, APP.FOLLOW_UP_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.OFFENSE_FQN, 0, APP.FOLLOW_UP_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.DISPOSITION_FQN, 0, APP.FOLLOW_UP_REPORT_FQN, NOW_DATA],

    // analytics
    [APP.SUBJECT_OF_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.REFERRAL_REQUEST_FQN, NOW_DATA],
    [APP.OBSERVED_IN_FQN, 0, APP.SUBSTANCE_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.OBSERVED_IN_FQN, 1, APP.SUBSTANCE_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.CLEARED_BY_FQN, incidentEKID, APP.INCIDENT_FQN, 0, APP.DISPOSITION_FQN, CLEARED_BY_DATA]
  ];

  return associations;
};

const getSectionProperties = (sectionSchema :Object) :Object => {

  const { type: sectionType } = sectionSchema;
  let path;

  // sectionValue should have type that matches type specified in schema type
  if (sectionType === 'array') {
    path = ['items', 'properties'];
  }
  else if (sectionType === 'object') {
    path = ['properties'];
  }
  else {
    throw Error('schema is incorrectly formatted');
  }

  return getIn(sectionSchema, path);
};

const getEntityAddressIndexByFQN = (schema) => {
  const entityAddressIndexByFQN = {};
  const { properties } = schema;

  Object.values(properties).forEach((sectionSchema) => {
    const sectionProperties = getSectionProperties(sectionSchema);
    Object.keys(sectionProperties).forEach((entityAddressKey) => {
      const { entityIndex, entitySetName } = parseEntityAddressKey(entityAddressKey);
      if (entityIndex < 0) {
        entityAddressIndexByFQN[entitySetName] = entityIndex;
      }
    });
  });

  return entityAddressIndexByFQN;
};

const getEntityIndexToIdMapFromNeighbors = (neighborsByFQN :Map, schema :Object) => {
  const entityAddressIndexByFQN = getEntityAddressIndexByFQN(schema);

  const entityIndexToIdMap = neighborsByFQN.toSeq().mapEntries(([fqn, entities]) => {
    const ekidMap = Map().withMutations((mutable) => {
      entities.forEach((entity, index) => {
        const entityAddressIndex = entityAddressIndexByFQN[fqn];
        const entityKeyId = getIn(entity, ['neighborDetails', FQN.OPENLATTICE_ID_FQN, 0]);
        // group by entityAddressIndex if defined
        if (entityAddressIndex) {
          if (mutable.has(entityAddressIndex)) {
            mutable.setIn([entityAddressIndex, index], entityKeyId);
          }
          else {
            mutable.set(entityAddressIndex, List([entityKeyId]));
          }
        }
        else {
          mutable.set(index, entity.getIn(['neighborDetails', FQN.OPENLATTICE_ID_FQN, 0]));
        }
      });
    });
    return [fqn, ekidMap];
  }).toMap();

  return entityIndexToIdMap;
};

// TODO: get entityIndextoIdMap from dataGraphResponse
const getEntityIndexToIdMapFromDataGraphResponse = (
  newEntityResponse :Map,
  schema :Object,
  appTypeFqnsByIds :Map
) :Map => {

  const entityAddressIndexByFQN = getEntityAddressIndexByFQN(schema);
  const entityKeyIds = newEntityResponse.get('entityKeyIds');
  const entityIndexToIdMap = entityKeyIds.mapEntries(([key, value]) => {
    const fqn = appTypeFqnsByIds.get(key);
    const entityAddressIndex = entityAddressIndexByFQN[fqn];
    if (entityAddressIndex) {
      return [fqn, Map([[
        entityAddressIndex,
        List(value)
      ]])];
    }
    return [fqn, value];
  });

  return fromJS(entityIndexToIdMap);
};

// parses a schema and generates formData from a map of neighbors keyed by their FQN
// does not respect edges, only entity set names
const constructFormDataFromNeighbors = (neighborsByFQN :Map, schema :Object) :Object => {
  const { properties } = schema;
  return Object.fromEntries(Object.entries(properties).map(([pageSectionKey, sectionSchema]) => {
    // $FlowFixMe destructure from mixed type
    const { type: sectionType } = sectionSchema;
    const sectionProperties = getSectionProperties(sectionSchema);

    // sectionValue should have type that matches type specified in schema type
    let sectionValue = sectionType === 'array' ? [] : {};

    Object.entries(sectionProperties).forEach(([entityAddressKey, propertySchema]) => {
      // $FlowFixMe destructure from mixed type
      const { type: propertyType, sharedProperty, skipPopulate } = propertySchema;

      if (skipPopulate) return;
      const propertyMultiplicity = propertyType === 'array';

      const {
        entityIndex,
        entitySetName,
        propertyTypeFQN,
      } = parseEntityAddressKey(entityAddressKey);

      // if sectionType is an array, iterate over neighbors of matching type
      if (sectionType === 'array' && entityIndex < 0) {
        const neighbors = neighborsByFQN.get(entitySetName, List());
        neighbors.forEach((neighbor, index) => {
          let value = neighbor.getIn(['neighborDetails', propertyTypeFQN], List()).toJS();
          if (!propertyMultiplicity) {
            value = value.pop();
          }
          sectionValue = setIn(sectionValue, [index, entityAddressKey], value);
        });
      }
      // otherwise section expects a fixed set of objects
      else {
        let value;
        // get first neighbor of type filtered by sharedProperty value
        if (sharedProperty) {
          const matchedEntity = neighborsByFQN.get(entitySetName, List())
            .filter((entity) => entity
              .getIn(['neighborDetails', sharedProperty.property], List())
              .includes(sharedProperty.value))
            .first() || Map();
          value = matchedEntity
            .getIn(['neighborDetails', propertyTypeFQN], List())
            .toJS();
        }
        else {
          value = neighborsByFQN.getIn([entitySetName, entityIndex, 'neighborDetails', propertyTypeFQN], List()).toJS();
        }
        if (!propertyMultiplicity) {
          value = value.pop();
        }
        sectionValue = setIn(sectionValue, [entityAddressKey], value);
      }
    });
    return [pageSectionKey, sectionValue];
  }));
};

// V1

const getPropertyValues = (entity, properties) => properties.map((property) => get(entity, property.toString(), []));

const getSectionValues = (formData, section, properties) => properties
  .map((property) => {
    const address = getEntityAddressKey(0, APP.BEHAVIORAL_HEALTH_REPORT_FQN, property);
    return getIn(formData, [section, address]);
  });

const getBHRAddress = (property) => getEntityAddressKey(0, APP.BEHAVIORAL_HEALTH_REPORT_FQN, property);


// merge standalone 'other' property with original and check for 'None'
// mutates passed in entity
const preProcessOther = (
  property :FullyQualifiedName | string,
  otherProperty :FullyQualifiedName | string,
  withNone = true,
) => (entity :Object) => {
  let propertyValue = get(entity, property.toString(), []);
  const otherPropertyValue = get(entity, otherProperty.toString(), []);

  if (isNonEmptyStringArray(otherPropertyValue)) {
    const filteredPropertyValue = propertyValue.filter((value) => (value !== 'Other')
    || !otherPropertyValue.includes(value));
    propertyValue = [...filteredPropertyValue, 'Other', ...otherPropertyValue];
  }
  if (withNone && !isNonEmptyStringArray(propertyValue)) propertyValue = ['None'];

  return setIn(entity, [property.toString()], propertyValue);
};

const pipe = (...fns) => (init) => fns.reduce((piped, f) => f(piped), init);

// pre/post processing of formData is to maintain interop with old bhr.report data submitted
// before facelift
// preprocessors manipulate report entity data before it is transformed to become formData
const preProcessessObservations = (report :Object) :Object => {
  const updatedReport = pipe(
    preProcessOther(FQN.DEMEANORS_FQN, FQN.OTHER_DEMEANORS_FQN),
    preProcessOther(FQN.OBSERVED_BEHAVIORS_FQN, FQN.OBSERVED_BEHAVIORS_OTHER_FQN),
    preProcessOther(FQN.SUICIDAL_ACTIONS_FQN, ''),
  )(report);

  const [militaryStatus] = getPropertyValues(report, [FQN.MILITARY_STATUS_FQN]);
  return setIn(updatedReport, [FQN.MILITARY_STATUS_FQN], [militaryStatus.includes('Veteran')]);
};

const preProcessessNature = (report :Object) :Object => {
  preProcessOther(FQN.PERSON_ASSISTING_FQN, FQN.OTHER_PERSON_ASSISTING_FQN);
  return report;
};

const preProcessessSafety = (report :Object) :Object => pipe(
  preProcessOther(FQN.ARMED_WEAPON_TYPE_FQN, FQN.OTHER_WEAPON_TYPE_FQN),
  preProcessOther(FQN.DIRECTED_AGAINST_RELATION_FQN, FQN.DIRECTED_AGAINST_OTHER_FQN),
  preProcessOther(FQN.PERSON_INJURED_FQN, FQN.OTHER_PERSON_INJURED_FQN),
)(report);

const preProcessArrest = (report :Object) :Object => {
  const [
    arrestableOffense,
    arrestIndicator,
    crimesAgainstPerson,
    felony,
  ] = getPropertyValues(report, [
    FQN.ARRESTABLE_OFFENSE_FQN,
    FQN.ARREST_INDICATOR_FQN,
    FQN.CRIMES_AGAINST_PERSON_FQN,
    FQN.FELONY_INDICATOR_FQN
  ]).map((property) => property[0]);
  const processedArrest = [];
  if (!arrestableOffense) {
    processedArrest.push('None');
  }
  else {
    if (arrestIndicator) {
      processedArrest.push(ARRESTED);
    }
    else {
      processedArrest.push(NOT_ARRESTED);
    }

    if (crimesAgainstPerson) processedArrest.push(CRIMES_AGAINST_PERSON);
    if (felony) processedArrest.push(FELONY);
  }

  return setIn(report, [FQN.ARRESTABLE_OFFENSE_FQN], processedArrest);
};

const preProcessessDisposition = (report :Object) :Object => pipe(
  preProcessOther(FQN.CATEGORY_FQN, FQN.OTHER_NOTIFIED_FQN),
  preProcessOther(FQN.REFERRAL_DEST_FQN, FQN.OTHER_TEXT_FQN),
  preProcessOther(FQN.ORGANIZATION_NAME_FQN, ''),
  preProcessArrest,
)(report);

// postprocessors manipulate formData for submission
const postProcessDisposition = (formData :Object) :Object => {
  const sectionKey = getPageSectionKey(5, 1);
  const sectionData = getIn(formData, [sectionKey]);

  const dispositionProperties = [
    FQN.CATEGORY_FQN,
    FQN.REFERRAL_DEST_FQN,
    FQN.ORGANIZATION_NAME_FQN,
    FQN.HOSPITAL_TRANSPORT_INDICATOR_FQN,
    FQN.NARCAN_ADMINISTERED_FQN,
    FQN.ARRESTABLE_OFFENSE_FQN,
  ];

  const disposition = [];

  sectionData[getBHRAddress(FQN.REFERRAL_PROVIDER_INDICATOR_FQN)] = false;
  sectionData[getBHRAddress(FQN.TRANSPORT_INDICATOR_FQN)] = false;

  const [
    notifiedValue,
    referralValue,
    transportValue,
    hospitalValue,
    naloxoneValue,
    offenseValue,
  ] = getSectionValues(formData, sectionKey, dispositionProperties);

  if (notifiedValue.length && !notifiedValue.includes('None')) {
    disposition.push(DISPOSITIONS.NOTIFIED_SOMEONE);
  }
  if (referralValue.length && !referralValue.includes('None')) {
    disposition.push(DISPOSITIONS.VERBAL_REFERRAL);
    sectionData[getBHRAddress(FQN.REFERRAL_PROVIDER_INDICATOR_FQN)] = true;
  }
  if (transportValue.length && !transportValue.includes('None')) {
    disposition.push(DISPOSITIONS.COURTESY_TRANPORT);
    sectionData[getBHRAddress(FQN.TRANSPORT_INDICATOR_FQN)] = true;
  }
  if (hospitalValue) {
    disposition.push(DISPOSITIONS.HOSPITAL);
  }
  if (naloxoneValue) {
    disposition.push(DISPOSITIONS.ADMINISTERED_DRUG);
  }

  if (offenseValue.length && !offenseValue.includes('None')) {
    disposition.push(DISPOSITIONS.ARRESTABLE_OFFENSE);
    sectionData[getBHRAddress(FQN.ARRESTABLE_OFFENSE_FQN)] = true;

    const notArrested = offenseValue.includes(NOT_ARRESTED);
    const arrested = offenseValue.includes(ARRESTED);
    const crimeAgainstPerson = offenseValue.includes(CRIMES_AGAINST_PERSON) || null;
    const felony = offenseValue.includes(FELONY) || null;

    if (arrested) {
      sectionData[getBHRAddress(FQN.ARREST_INDICATOR_FQN)] = arrested;
    }
    else if (notArrested) {
      sectionData[getBHRAddress(FQN.ARREST_INDICATOR_FQN)] = !notArrested;
    }
    else {
      sectionData[getBHRAddress(FQN.ARREST_INDICATOR_FQN)] = null;
    }

    sectionData[getBHRAddress(FQN.CRIMES_AGAINST_PERSON_FQN)] = crimeAgainstPerson;
    sectionData[getBHRAddress(FQN.FELONY_INDICATOR_FQN)] = felony;
  }
  else {
    sectionData[getBHRAddress(FQN.ARRESTABLE_OFFENSE_FQN)] = false;
    sectionData[getBHRAddress(FQN.ARREST_INDICATOR_FQN)] = null;
    sectionData[getBHRAddress(FQN.CRIMES_AGAINST_PERSON_FQN)] = null;
    sectionData[getBHRAddress(FQN.FELONY_INDICATOR_FQN)] = null;
  }

  sectionData[getBHRAddress(FQN.DISPOSITION_FQN)] = disposition;

  return setIn(formData, [sectionKey], sectionData);
};

const postProcessSafetySection = (formData :Object) :Object => {
  const sectionKey = getPageSectionKey(4, 1);
  const sectionData = getIn(formData, [sectionKey]);

  const safetyProperties = [
    FQN.ARMED_WEAPON_TYPE_FQN,
    FQN.DIRECTED_AGAINST_RELATION_FQN
  ];

  sectionData[getBHRAddress(FQN.ARMED_WITH_WEAPON_FQN)] = false;
  sectionData[getBHRAddress(FQN.THREATENED_INDICATOR_FQN)] = false;

  const [
    weaponValue,
    threatenedValue
  ] = getSectionValues(formData, sectionKey, safetyProperties);

  if (weaponValue.length && !weaponValue.includes('None')) {
    sectionData[getBHRAddress(FQN.ARMED_WITH_WEAPON_FQN)] = true;
  }
  if (threatenedValue.length && !threatenedValue.includes('None')) {
    sectionData[getBHRAddress(FQN.THREATENED_INDICATOR_FQN)] = true;
  }

  return setIn(formData, [sectionKey], sectionData);
};

const postProcessNatureSection = (formData :Object) :Object => {
  const sectionKey = getPageSectionKey(3, 1);
  const sectionData = getIn(formData, [sectionKey]);

  const housingProperties = [FQN.HOUSING_SITUATION_FQN];

  sectionData[getBHRAddress(FQN.HOMELESS_FQN)] = false;

  const [
    housingValue,
  ] = getSectionValues(formData, sectionKey, housingProperties);

  if (housingValue === HOMELESS_STR) {
    sectionData[getBHRAddress(FQN.HOMELESS_FQN)] = true;
  }

  return setIn(formData, [sectionKey], sectionData);
};

const postProcessBehaviorSection = (formData :Object) :Object => {
  const sectionKey = getPageSectionKey(2, 1);
  const sectionData = getIn(formData, [sectionKey]);

  const behaviorProperties = [FQN.OBSERVED_BEHAVIORS_FQN, FQN.SUICIDAL_ACTIONS_FQN, FQN.MILITARY_STATUS_FQN];

  sectionData[getBHRAddress(FQN.SUICIDAL_FQN)] = false;

  const [
    behaviorValue,
    suicidalActionsValue,
    militaryStatusValue
  ] = getSectionValues(formData, sectionKey, behaviorProperties);

  const suicidal = suicidalActionsValue.includes(THREAT) || suicidalActionsValue.includes(ATTEMPT);
  if (suicidalActionsValue.length && suicidal) {
    sectionData[getBHRAddress(FQN.OBSERVED_BEHAVIORS_FQN)] = behaviorValue
      .concat(SUICIDE_BEHAVIORS);
    sectionData[getBHRAddress(FQN.SUICIDAL_FQN)] = true;
  }
  else {
    sectionData[getBHRAddress(FQN.OBSERVED_BEHAVIORS_FQN)] = behaviorValue
      .filter((behavior) => behavior !== SUICIDE_BEHAVIORS);
  }

  if (militaryStatusValue) {
    sectionData[getBHRAddress(FQN.MILITARY_STATUS_FQN)] = 'Veteran';
  }
  else {
    sectionData[getBHRAddress(FQN.MILITARY_STATUS_FQN)] = null;
  }

  return setIn(formData, [sectionKey], sectionData);
};

const preProcessCrisisReportV1 = (report :Object) => {
  const copyReport = fromJS(report).toJS();
  const processedReport = pipe(
    preProcessessObservations,
    preProcessessNature,
    preProcessessSafety,
    preProcessessDisposition,
  )(copyReport);

  return processedReport;
};

const postProcessCrisisReportV1 = (formData :Object) :Object => {
  const copyFormData = fromJS(formData).toJS();
  const processedFormData = pipe(
    postProcessBehaviorSection,
    postProcessNatureSection,
    postProcessSafetySection,
    postProcessDisposition,
  )(copyFormData);

  return processedFormData;
};

export {
  constructFormDataFromNeighbors,
  getClinicianCrisisReportAssociations,
  getCrisisReportAssociations,
  getEntityIndexToIdMapFromDataGraphResponse,
  getEntityIndexToIdMapFromNeighbors,
  getFollowupReportAssociations,
  getOfficerCrisisReportAssociations,
  getOptionalCrisisReportAssociations,
  postProcessBehaviorSection,
  postProcessCrisisReportV1,
  postProcessDisposition,
  postProcessNatureSection,
  postProcessSafetySection,
  preProcessCrisisReportV1,
};
