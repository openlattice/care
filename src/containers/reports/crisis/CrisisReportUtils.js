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
  NO_ACTION_NECESSARY,
  RESOURCES_DECLINED,
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

const postProcessCrisisReportV1 = (formData) :Object => {
  // for each of the dispositions, append to disposition the name of the field if the value is not 'No' or 'None'
  const dispositionSection = getPageSectionKey(5, 1);
  const safetySection = getPageSectionKey(4, 1);

  const dispositionProperties = [
    FQN.CATEGORY_FQN,
    FQN.REFERRAL_DEST_FQN,
    FQN.ORGANIZATION_NAME_FQN,
    FQN.HOSPITAL_TRANSPORT_INDICATOR_FQN,
    FQN.NARCAN_ADMINISTERED_FQN,
    FQN.ARRESTABLE_OFFENSE_FQN,
    FQN.NO_ACTION_POSSIBLE_FQN,
  ];

  const safetyProperties = [
    FQN.ARMED_WEAPON_TYPE_FQN,
    FQN.DIRECTED_AGAINST_RELATION_FQN
  ];

  const disposition = [];
  let transportIndicator = false;
  let noActionPossible = false;
  let unableToContact = false;
  let resourcesDeclined = false;
  let arrestedIndicator = false;
  let crimeAgainstPerson = false;
  let felony = false;
  let referralProvided = false;
  let threatenedIndicator = false;
  let armedWithWeapon = false;

  const [
    weaponValue,
    threatenedValue
  ] = getSectionValues(formData, safetySection, safetyProperties);

  if (weaponValue.length && !weaponValue.includes('None')) {
    armedWithWeapon = true;
  }
  if (threatenedValue.length && !threatenedValue.includes('None')) {
    threatenedIndicator = true;
  }

  const [
    notifiedValue,
    referralValue,
    transportValue,
    hospitalValue,
    naloxoneValue,
    offenseValue,
    actionValue,
  ] = getSectionValues(formData, dispositionSection, dispositionProperties);

  if (notifiedValue.length && !notifiedValue.includes('None')) {
    disposition.concat(DISPOSITIONS.NOTIFIED_SOMEONE);
  }
  if (referralValue.length && !referralValue.includes('None')) {
    disposition.concat(DISPOSITIONS.VERBAL_REFERRAL);
    referralProvided = true;
  }
  if (transportValue.length && !transportValue.includes('None')) {
    disposition.concat(DISPOSITIONS.COURTESY_TRANPORT);
    transportIndicator = true;
  }
  if (hospitalValue) {
    disposition.concat(DISPOSITIONS.HOSPITAL);
  }
  if (naloxoneValue) {
    disposition.concat(DISPOSITIONS.ADMINISTERED_DRUG);
  }
  if (offenseValue.length && !offenseValue.includes('None')) {
    disposition.concat(DISPOSITIONS.ARRESTABLE_OFFENSE);
    arrestedIndicator = offenseValue.includes(ARRESTED);
    crimeAgainstPerson = offenseValue.includes(CRIMES_AGAINST_PERSON);
    felony = offenseValue.includes(FELONY);
  }
  if (actionValue.length) {
    disposition.concat(DISPOSITIONS.NO_ACTION_POSSIBLE);
    noActionPossible = actionValue.includes(NO_ACTION_NECESSARY);
    unableToContact = actionValue.includes(UNABLE_TO_CONTACT);
    resourcesDeclined = actionValue.includes(RESOURCES_DECLINED);
  }
};

export {
  constructFormDataFromNeighbors,
  getCrisisReportAssociations,
  getEntityIndexToIdMapFromDataGraphResponse,
  getEntityIndexToIdMapFromNeighbors,
  getNewCrisisReportAssociations,
  getOptionalCrisisReportAssociations,
};