// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_PROFILE_REPORTS :'GET_PROFILE_REPORTS' = 'GET_PROFILE_REPORTS';
const getProfileReports :RequestSequence = newRequestSequence(GET_PROFILE_REPORTS);

const GET_PROFILE_INCIDENTS :'GET_PROFILE_INCIDENTS' = 'GET_PROFILE_INCIDENTS';
const getProfileIncidents :RequestSequence = newRequestSequence(GET_PROFILE_INCIDENTS);

const GET_INCIDENT_REPORTS_SUMMARY :'GET_INCIDENT_REPORTS_SUMMARY' = 'GET_INCIDENT_REPORTS_SUMMARY';
const getIncidentReportsSummary :RequestSequence = newRequestSequence(GET_INCIDENT_REPORTS_SUMMARY);

const GET_INCIDENT_REPORTS :'GET_INCIDENT_REPORTS' = 'GET_INCIDENT_REPORTS';
const getIncidentReports :RequestSequence = newRequestSequence(GET_INCIDENT_REPORTS);

const GET_REPORTS_NEIGHBORS :'GET_REPORTS_NEIGHBORS' = 'GET_REPORTS_NEIGHBORS';
const getReportsNeighbors :RequestSequence = newRequestSequence(GET_REPORTS_NEIGHBORS);

export {
  GET_INCIDENT_REPORTS,
  GET_INCIDENT_REPORTS_SUMMARY,
  GET_PROFILE_INCIDENTS,
  GET_PROFILE_REPORTS,
  GET_REPORTS_NEIGHBORS,
  getIncidentReports,
  getIncidentReportsSummary,
  getProfileIncidents,
  getProfileReports,
  getReportsNeighbors,
};
