// @flow
import {
  List,
  Map,
  fromJS,
  get,
  getIn,
  setIn,
} from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import {
  ARRESTED,
  CRIMES_AGAINST_PERSON,
  DISPOSITIONS,
  FELONY,
  HOMELESS_STR,
  NO_ACTION_NECESSARY,
  RESOURCES_DECLINED,
  SUICIDE_BEHAVIORS,
  UNABLE_TO_CONTACT
} from './schemas/v1/constants';

import * as FQN from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS as APP } from '../../../shared/Consts';

const {
  getEntityAddressKey,
  getPageSectionKey,
  parseEntityAddressKey,
} = DataProcessingUtils;

const getDiagnosisAssociations = (formData, existingEntityKeyIds, createdDateTime) => {
  const associations = [];
  const diagnosis = get(formData, getPageSectionKey(4, 1), []);
  const reportIndex = existingEntityKeyIds[APP.CLINICIAN_REPORT_FQN] || 0;

  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };

  for (let i = 0; i < diagnosis.length; i += 1) {
    associations.push([
      APP.PART_OF_FQN,
      i,
      APP.DIAGNOSIS_FQN,
      reportIndex,
      APP.CLINICIAN_REPORT_FQN,
      NOW_DATA,
    ]);
  }
  return associations;
};

const getMedicationAssociations = (formData, existingEntityKeyIds, createdDateTime) => {
  const associations = [];
  const medications = get(formData, getPageSectionKey(4, 2), []);
  const reportIndex = existingEntityKeyIds[APP.CLINICIAN_REPORT_FQN] || 0;

  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };

  for (let i = 0; i < medications.length; i += 1) {
    associations.push([
      APP.PART_OF_FQN,
      i,
      APP.MEDICATION_STATEMENT_FQN,
      reportIndex,
      APP.CLINICIAN_REPORT_FQN,
      NOW_DATA,
    ]);
  }
  return associations;
};

const getOptionalCrisisReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO()
) :any[][] => {
  const associations = [];

  const diagnosis :any[][] = getDiagnosisAssociations(formData, existingEntityKeyIds, createdDateTime);
  const medications :any[][] = getMedicationAssociations(formData, existingEntityKeyIds, createdDateTime);

  return associations.concat(diagnosis, medications);
};

const getCrisisReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO()
) :any[][] => {
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];

  const NOW_DATA = { [FQN.DATE_TIME_FQN]: [createdDateTime] };
  const associations :any[][] = [
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.BEHAVIORAL_HEALTH_REPORT_FQN, NOW_DATA],
    [APP.APPEARS_IN_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.BEHAVIORAL_HEALTH_REPORT_FQN, NOW_DATA],
  ];

  return associations;
};

const getNewCrisisReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO()
) :any[][] => {
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];

  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };

  // static assocations
  const associations :any[][] = [
    [APP.INVOLVED_IN_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.INCIDENT_FQN, NOW_DATA],
    [APP.LOCATED_AT_FQN, 0, APP.INCIDENT_FQN, 0, APP.LOCATION_FQN, NOW_DATA],
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.INCIDENT_FQN, NOW_DATA],
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INCIDENT_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.NATURE_OF_CRISIS_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.BEHAVIOR_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SUBSTANCE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 1, APP.SUBSTANCE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.WEAPON_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.VIOLENT_BEHAVIOR_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INJURY_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SELF_HARM_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.HOUSING_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.OCCUPATION_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INCOME_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INSURANCE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 1, APP.INSURANCE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INTERACTION_STRATEGY_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.ENCOUNTER_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.ENCOUNTER_DETAILS_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INVOICE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.REFERRAL_REQUEST_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
  ];

  const optionalAssociations :any[][] = getOptionalCrisisReportAssociations(
    formData,
    existingEntityKeyIds,
    createdDateTime
  );

  return associations.concat(optionalAssociations);
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
          const matchedEntity = neighborsByFQN.get(entitySetName)
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

const getSectionValues = (formData, section, properties) => properties
  .map((property) => {
    const address = getEntityAddressKey(0, APP.BEHAVIORAL_HEALTH_REPORT_FQN, property);
    return getIn(formData, [section, address]);
  });

const getBHRAddress = (property) => getEntityAddressKey(0, APP.BEHAVIORAL_HEALTH_REPORT_FQN, property);

const postProcessDisposition = (formData) :Object => {
  const sectionKey = getPageSectionKey(5, 1);
  const sectionData = getIn(formData, [sectionKey]);

  const dispositionProperties = [
    FQN.CATEGORY_FQN,
    FQN.REFERRAL_DEST_FQN,
    FQN.ORGANIZATION_NAME_FQN,
    FQN.HOSPITAL_TRANSPORT_INDICATOR_FQN,
    FQN.NARCAN_ADMINISTERED_FQN,
    FQN.ARRESTABLE_OFFENSE_FQN,
    FQN.NO_ACTION_POSSIBLE_FQN,
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
    actionValue,
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

    const arrestedIndicator = offenseValue.includes(ARRESTED);
    const crimeAgainstPerson = offenseValue.includes(CRIMES_AGAINST_PERSON);
    const felony = offenseValue.includes(FELONY);

    sectionData[getBHRAddress(FQN.ARREST_INDICATOR_FQN)] = arrestedIndicator;
    sectionData[getBHRAddress(FQN.CRIMES_AGAINST_PERSON_FQN)] = crimeAgainstPerson;
    sectionData[getBHRAddress(FQN.FELONY_INDICATOR_FQN)] = felony;
  }
  if (actionValue.length) {
    disposition.push(DISPOSITIONS.NO_ACTION_POSSIBLE);
    const noActionPossible = actionValue.includes(NO_ACTION_NECESSARY);
    const unableToContact = actionValue.includes(UNABLE_TO_CONTACT);
    const resourcesDeclined = actionValue.includes(RESOURCES_DECLINED);

    sectionData[getBHRAddress(FQN.NO_ACTION_POSSIBLE_FQN)] = noActionPossible;
    sectionData[getBHRAddress(FQN.UNABLE_TO_CONTACT_FQN)] = unableToContact;
    sectionData[getBHRAddress(FQN.RESOURCES_DECLINED_FQN)] = resourcesDeclined;
  }

  sectionData[getBHRAddress(FQN.DISPOSITION_FQN)] = disposition;

  return setIn(formData, [sectionKey], sectionData);
};

const postProcessSafetySection = (formData) :Object => {
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

const postProcessNatureSection = (formData) :Object => {
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

const postProcessBehaviorSection = (formData) :Object => {
  const sectionKey = getPageSectionKey(2, 1);
  const sectionData = getIn(formData, [sectionKey]);

  const behaviorProperties = [FQN.OBSERVED_BEHAVIORS_FQN];

  sectionData[getBHRAddress(FQN.SUICIDAL_FQN)] = false;

  const [
    behaviorValue,
  ] = getSectionValues(formData, sectionKey, behaviorProperties);

  if (behaviorValue.length && behaviorValue.includes(SUICIDE_BEHAVIORS)) {
    sectionData[getBHRAddress(FQN.SUICIDAL_FQN)] = true;
  }

  return setIn(formData, [sectionKey], sectionData);
};

const pipe = (...fns) => (init) => fns.reduce((piped, f) => f(piped), init);

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
  postProcessCrisisReportV1,
  constructFormDataFromNeighbors,
  getCrisisReportAssociations,
  getEntityIndexToIdMapFromDataGraphResponse,
  getEntityIndexToIdMapFromNeighbors,
  getNewCrisisReportAssociations,
  getOptionalCrisisReportAssociations,
};
