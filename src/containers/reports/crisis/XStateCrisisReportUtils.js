// @flow
import {
  List,
  Map,
  get,
  getIn,
  setIn,
} from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { COMPLETED_DT_FQN } from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS as APP } from '../../../shared/Consts';

const { getPageSectionKey, parseEntityAddressKey } = DataProcessingUtils;

const getCrisisReportAssociations = (formData :Object, existingEntityKeyIds :Object) => {
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];
  const now = DateTime.local().toISO();

  const NOW_DATA = { [COMPLETED_DT_FQN]: [now] };
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
    [APP.PART_OF_FQN, 0, APP.SUBSTANCE_HISTORY_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.WEAPON_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.VIOLENT_BEHAVIOR_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INJURY_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SELF_HARM_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.HOUSING_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INCOME_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INSURANCE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 1, APP.INSURANCE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INTERACTION_STRATEGY_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.ENCOUNTER_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.ENCOUNTER_DETAILS_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INVOICE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.REFERRAL_REQUEST_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
  ];

  const diagnosis = get(formData, getPageSectionKey(4, 1), []);
  const medications = get(formData, getPageSectionKey(4, 2), []);

  for (let i = 0; i < diagnosis.length; i += 1) {
    associations.push([APP.PART_OF_FQN, i, APP.DIAGNOSIS_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA]);
  }

  for (let i = 0; i < medications.length; i += 1) {
    associations.push([APP.PART_OF_FQN, i, APP.MEDICATION_STATEMENT_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA]);
  }

  return associations;
};

// parses a schema and generates formData from a map of neighbors keyed by their FQN
// does not respect edges, only entity set names
const constructFormDataFromNeighbors = (neighborsByFQN :Map, schema :Object) :Map => {
  const { properties } = schema;
  return Object.fromEntries(Object.entries(properties).map(([pageSectionKey, sectionSchema]) => {
    // $FlowFixMe destructure from mixed type
    const { type: sectionType } = sectionSchema;
    let path;

    // sectionValue should have type that matches type specified in schema type
    let sectionValue = {};
    if (sectionType === 'array') {
      path = ['items', 'properties'];
      sectionValue = [];
    }
    else if (sectionType === 'object') {
      path = ['properties'];
    }
    else {
      throw Error('schema is incorrectly formatted');
    }

    const sectionProperties = getIn(sectionSchema, path);

    Object.entries(sectionProperties).forEach(([entityAddressKey, propertySchema]) => {
      // $FlowFixMe destructure from mixed type
      const { type: propertyType } = propertySchema;

      const propertyMultiplicity = propertyType === 'array';

      const {
        entityIndex,
        entitySetName,
        propertyTypeFQN,
      } = parseEntityAddressKey(entityAddressKey);

      // if sectionType is an array, iterate over neighbors of matching type
      if (sectionType === 'array' && entityIndex < 0) {
        const neighbors = neighborsByFQN.get(entitySetName);
        neighbors.forEach((neighbor, index) => {
          let value = neighbor.get(propertyTypeFQN, List()).toJS();
          if (!propertyMultiplicity) {
            value = value.pop();
          }
          sectionValue = setIn(sectionValue, [index, entityAddressKey], value);
        });
      }
      // otherwise schema only expects a single entity per section as object
      else {
        let value = neighborsByFQN.getIn([entitySetName, entityIndex, propertyTypeFQN], List()).toJS();
        if (!propertyMultiplicity) {
          value = value.pop();
        }
        sectionValue = setIn(sectionValue, [entityAddressKey], value);
      }
    });
    return [pageSectionKey, sectionValue];
  }));
};

export { constructFormDataFromNeighbors, getCrisisReportAssociations };
