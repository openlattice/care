/*
 * @flow
 */

import React, { Component } from 'react';

import moment from 'moment';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import ComplainantInfoView from '../../components/ComplainantInfoView';
import ConsumerInfoView from '../../components/ConsumerInfoView';
import DispositionView from '../../components/DispositionView';
import OfficerInfoView from '../../components/OfficerInfoView';
import ReportInfoView from '../../components/ReportInfoView';

import Spinner from '../../components/spinner/Spinner';
import StyledCard from '../../components/cards/StyledCard';
import { getReports } from './ReportsActions';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { REPORTS_PATH } from '../../core/router/Routes';
import {
  ContentContainerInnerWrapper,
  ContentContainerOuterWrapper,
} from '../../components/layout';

import {
  // ReportInfoView
  CAD_NUMBER_FQN,
  COMPANION_OFFENSE_REPORT_FQN,
  COMPLAINT_NUMBER_FQN,
  DATE_OCCURRED_FQN,
  DATE_REPORTED_FQN,
  DISPATCH_REASON_FQN,
  INCIDENT_FQN,
  LOCATION_OF_INCIDENT_FQN,
  ON_VIEW_FQN,
  POST_OF_OCCURRENCE_FQN,
  TIME_OCCURRED_FQN,
  TIME_REPORTED_FQN,
  UNIT_FQN,
  // ConsumerInfoView
  ADDRESS_FQN,
  PHONE_FQN,
  MILITARY_STATUS_FQN,
  GENDER_FQN,
  RACE_FQN,
  AGE_FQN,
  DOB_FQN,
  HOMELESS_FQN,
  HOMELESS_LOCATION_FQN,
  DRUGS_ALCOHOL_FQN,
  DRUG_TYPE_FQN,
  PRESCRIBED_MEDICATION_FQN,
  TAKING_MEDICATION_FQN,
  PREV_PSYCH_ADMISSION_FQN,
  SELF_DIAGNOSIS_FQN,
  SELF_DIAGNOSIS_OTHER_FQN,
  ARMED_WITH_WEAPON_FQN,
  ARMED_WEAPON_TYPE_FQN,
  ACCESS_TO_WEAPONS_FQN,
  ACCESSIBLE_WEAPON_TYPE_FQN,
  OBSERVED_BEHAVIORS_FQN,
  OBSERVED_BEHAVIORS_OTHER_FQN,
  EMOTIONAL_STATE_FQN,
  EMOTIONAL_STATE_OTHER_FQN,
  PHOTOS_TAKEN_OF_FQN,
  INJURIES_FQN,
  INJURIES_OTHER_FQN,
  SUICIDAL_FQN,
  SUICIDAL_ACTIONS_FQN,
  SUICIDE_ATTEMPT_METHOD_FQN,
  SUICIDE_ATTEMPT_METHOD_OTHER_FQN,
  DIRECTED_AGAINST_FQN,
  DIRECTED_AGAINST_OTHER_FQN,
  HIST_DIRECTED_AGAINST_FQN,
  HIST_DIRECTED_AGAINST_OTHER_FQN,
  HISTORY_OF_VIOLENCE_FQN,
  HISTORY_OF_VIOLENCE_TEXT_FQN,
  SCALE_1_TO_10_FQN,
  // Person
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_ID_FQN,
  PERSON_PICTURE_FQN,
  HACKY_FIRST_NAME_FQN,
  HACKY_MIDDLE_NAME_FQN,
  HACKY_LAST_NAME_FQN,
  HACKY_ID_FQN,
  // ComplainantInfoView
  COMPLAINANT_NAME_FQN,
  COMPLAINANT_ADDRESS_FQN,
  COMPLAINANT_RELATIONSHIP_FQN,
  COMPLAINANT_PHONE_FQN,
  // DispositionInfoView
  DEESCALATION_SCALE_FQN,
  DEESCALATION_TECHNIQUES_FQN,
  DEESCALATION_TECHNIQUES_OTHER_FQN,
  DISPOSITION_FQN,
  HOSPITAL_TRANSPORT_INDICATOR_FQN,
  HOSPITAL_FQN,
  HOSPITAL_NAME_FQN,
  INCIDENT_NARRATIVE_FQN,
  REFERRAL_DEST_FQN,
  REFERRAL_PROVIDER_INDICATOR_FQN,
  SPECIAL_RESOURCES_CALLED_FQN,
  STABILIZED_INDICATOR_FQN,
  TRANSPORTING_AGENCY_FQN,
  VOLUNTARY_ACTION_INDICATOR_FQN,
  // OfficerInfoView
  OFFICER_NAME_FQN,
  OFFICER_SEQ_ID_FQN,
  OFFICER_INJURIES_FQN,
  OFFICER_CERTIFICATION_FQN,
} from '../../edm/DataModelFqns';

const {
  BEHAVIORAL_HEALTH_REPORT_FQN,
} = APP_TYPES_FQNS;

type Props = {
  actions :{
    getReportInFull :RequestSequence;
  };
  isFetchingReportInFull :boolean;
  selectedOrganizationId :string;
  selectedReportEntityKeyId :string;
  selectedReportData :Map<*, *>;
};

function gatherReportData(data :Map<*, *>) :{[key :string] :any} {

  const result = {
    [CAD_NUMBER_FQN.getName()]: data.getIn([CAD_NUMBER_FQN.toString(), 0]),
    [COMPANION_OFFENSE_REPORT_FQN.getName()]: data.getIn([COMPANION_OFFENSE_REPORT_FQN.toString(), 0]),
    [COMPLAINT_NUMBER_FQN.getName()]: data.getIn([COMPLAINT_NUMBER_FQN.toString(), 0]),
    [DISPATCH_REASON_FQN.getName()]: data.getIn([DISPATCH_REASON_FQN.toString(), 0]),
    [INCIDENT_FQN.getName()]: data.getIn([INCIDENT_FQN.toString(), 0]),
    [LOCATION_OF_INCIDENT_FQN.getName()]: data.getIn([LOCATION_OF_INCIDENT_FQN.toString(), 0]),
    [ON_VIEW_FQN.getName()]: data.getIn([ON_VIEW_FQN.toString(), 0]),
    [POST_OF_OCCURRENCE_FQN.getName()]: data.getIn([POST_OF_OCCURRENCE_FQN.toString(), 0]),
    [TIME_OCCURRED_FQN.getName()]: data.getIn([TIME_OCCURRED_FQN.toString(), 0]),
    [TIME_REPORTED_FQN.getName()]: data.getIn([TIME_REPORTED_FQN.toString(), 0]),
    [UNIT_FQN.getName()]: data.getIn([UNIT_FQN.toString(), 0]),
  };

  // special cases
  result[DATE_OCCURRED_FQN.getName()] = moment(result[DATE_OCCURRED_FQN.getName()]).format('YYYY-MM-DD');
  result[DATE_REPORTED_FQN.getName()] = moment(result[DATE_REPORTED_FQN.getName()]).format('YYYY-MM-DD');

  return result;
}

function gatherConsumerData(data :Map<*, *>) :{[key :string] :any} {

  const result = {
    [ADDRESS_FQN.getName()]: data.getIn([ADDRESS_FQN.toString(), 0]),
    [PHONE_FQN.getName()]: data.getIn([PHONE_FQN.toString(), 0]),
    [MILITARY_STATUS_FQN.getName()]: data.getIn([MILITARY_STATUS_FQN.toString(), 0]),
    [AGE_FQN.getName()]: data.getIn([AGE_FQN.toString(), 0]),
    [HOMELESS_FQN.getName()]: data.getIn([HOMELESS_FQN.toString(), 0]),
    [HOMELESS_LOCATION_FQN.getName()]: data.getIn([HOMELESS_LOCATION_FQN.toString(), 0]),
    [DRUGS_ALCOHOL_FQN.getName()]: data.getIn([DRUGS_ALCOHOL_FQN.toString(), 0]),
    [DRUG_TYPE_FQN.getName()]: data.getIn([DRUG_TYPE_FQN.toString(), 0]),
    [PRESCRIBED_MEDICATION_FQN.getName()]: data.getIn([PRESCRIBED_MEDICATION_FQN.toString(), 0]),
    [TAKING_MEDICATION_FQN.getName()]: data.getIn([TAKING_MEDICATION_FQN.toString(), 0]),
    [PREV_PSYCH_ADMISSION_FQN.getName()]: data.getIn([PREV_PSYCH_ADMISSION_FQN.toString(), 0]),
    [SELF_DIAGNOSIS_OTHER_FQN.getName()]: data.getIn([SELF_DIAGNOSIS_OTHER_FQN.toString(), 0]),
    [ARMED_WITH_WEAPON_FQN.getName()]: data.getIn([ARMED_WITH_WEAPON_FQN.toString(), 0]),
    [ARMED_WEAPON_TYPE_FQN.getName()]: data.getIn([ARMED_WEAPON_TYPE_FQN.toString(), 0]),
    [ACCESS_TO_WEAPONS_FQN.getName()]: data.getIn([ACCESS_TO_WEAPONS_FQN.toString(), 0]),
    [ACCESSIBLE_WEAPON_TYPE_FQN.getName()]: data.getIn([ACCESSIBLE_WEAPON_TYPE_FQN.toString(), 0]),
    [OBSERVED_BEHAVIORS_OTHER_FQN.getName()]: data.getIn([OBSERVED_BEHAVIORS_OTHER_FQN.toString(), 0]),
    [EMOTIONAL_STATE_OTHER_FQN.getName()]: data.getIn([EMOTIONAL_STATE_OTHER_FQN.toString(), 0]),
    [INJURIES_OTHER_FQN.getName()]: data.getIn([INJURIES_OTHER_FQN.toString(), 0]),
    [SUICIDAL_FQN.getName()]: data.getIn([SUICIDAL_FQN.toString(), 0]),
    [SUICIDE_ATTEMPT_METHOD_OTHER_FQN.getName()]: data.getIn([SUICIDE_ATTEMPT_METHOD_OTHER_FQN.toString(), 0]),
    [DIRECTED_AGAINST_OTHER_FQN.getName()]: data.getIn([DIRECTED_AGAINST_OTHER_FQN.toString(), 0]),
    [HIST_DIRECTED_AGAINST_OTHER_FQN.getName()]: data.getIn([HIST_DIRECTED_AGAINST_OTHER_FQN.toString(), 0]),
    [HISTORY_OF_VIOLENCE_FQN.getName()]: data.getIn([HISTORY_OF_VIOLENCE_FQN.toString(), 0]),
    [HISTORY_OF_VIOLENCE_TEXT_FQN.getName()]: data.getIn([HISTORY_OF_VIOLENCE_TEXT_FQN.toString(), 0]),
    [SCALE_1_TO_10_FQN.getName()]: data.getIn([SCALE_1_TO_10_FQN.toString(), 0]),
  };

  // special cases
  result[INJURIES_FQN.getName()] = data.get(INJURIES_FQN.toString(), List()).toJS();
  result[EMOTIONAL_STATE_FQN.getName()] = data.get(EMOTIONAL_STATE_FQN.toString(), List()).toJS();
  result[OBSERVED_BEHAVIORS_FQN.getName()] = data.get(OBSERVED_BEHAVIORS_FQN.toString(), List()).toJS();
  result[SELF_DIAGNOSIS_FQN.getName()] = data.get(SELF_DIAGNOSIS_FQN.toString(), List()).toJS();
  result[SUICIDAL_ACTIONS_FQN.getName()] = data.get(SUICIDAL_ACTIONS_FQN.toString(), List()).toJS();
  result[SUICIDE_ATTEMPT_METHOD_FQN.getName()] = data.get(SUICIDE_ATTEMPT_METHOD_FQN.toString(), List()).toJS();
  result[PHOTOS_TAKEN_OF_FQN.getName()] = data.get(PHOTOS_TAKEN_OF_FQN.toString(), List()).toJS();
  result[DIRECTED_AGAINST_FQN.getName()] = data.get(DIRECTED_AGAINST_FQN.toString(), List()).toJS();
  result[HIST_DIRECTED_AGAINST_FQN.getName()] = data.get(HIST_DIRECTED_AGAINST_FQN.toString(), List()).toJS();

  result[HACKY_ID_FQN.getName()] = data.getIn([PERSON_ID_FQN.toString(), 0]);
  result[HACKY_FIRST_NAME_FQN.getName()] = data.getIn([PERSON_FIRST_NAME_FQN.toString(), 0]);
  result[HACKY_MIDDLE_NAME_FQN.getName()] = data.getIn([PERSON_MIDDLE_NAME_FQN.toString(), 0]);
  result[HACKY_LAST_NAME_FQN.getName()] = data.getIn([PERSON_LAST_NAME_FQN.toString(), 0]);
  result[DOB_FQN.getName()] = moment(data.getIn([PERSON_DOB_FQN.toString(), 0])).format('YYYY-MM-DD');
  result[GENDER_FQN.getName()] = data.getIn([PERSON_SEX_FQN.toString(), 0]);
  result[RACE_FQN.getName()] = data.getIn([PERSON_RACE_FQN.toString(), 0]);
  result[PERSON_PICTURE_FQN.getName()] = data.getIn([PERSON_PICTURE_FQN.toString(), 0]);

  return result;
}

function gatherComplainantData(data :Map<*, *>) :{[key :string] :any} {

  const result = {
    [COMPLAINANT_NAME_FQN.getName()]: data.getIn([COMPLAINANT_NAME_FQN.toString(), 0]),
    [COMPLAINANT_ADDRESS_FQN.getName()]: data.getIn([COMPLAINANT_ADDRESS_FQN.toString(), 0]),
    [COMPLAINANT_RELATIONSHIP_FQN.getName()]: data.getIn([COMPLAINANT_RELATIONSHIP_FQN.toString(), 0]),
    [COMPLAINANT_PHONE_FQN.getName()]: data.getIn([COMPLAINANT_PHONE_FQN.toString(), 0]),
  };

  return result;
}

function gatherDispositionData(data :Map<*, *>) :{[key :string] :any} {

  const result = {
    [DEESCALATION_SCALE_FQN.getName()]: data.getIn([DEESCALATION_SCALE_FQN.toString(), 0]),
    [DEESCALATION_TECHNIQUES_OTHER_FQN.getName()]: data.getIn([DEESCALATION_TECHNIQUES_OTHER_FQN.toString(), 0]),
    [HOSPITAL_TRANSPORT_INDICATOR_FQN.getName()]: data.getIn([HOSPITAL_TRANSPORT_INDICATOR_FQN.toString(), 0]),
    [HOSPITAL_FQN.getName()]: data.getIn([HOSPITAL_FQN.toString(), 0]),
    [HOSPITAL_NAME_FQN.getName()]: data.getIn([HOSPITAL_NAME_FQN.toString(), 0]),
    [INCIDENT_NARRATIVE_FQN.getName()]: data.getIn([INCIDENT_NARRATIVE_FQN.toString(), 0]),
    [REFERRAL_DEST_FQN.getName()]: data.getIn([REFERRAL_DEST_FQN.toString(), 0]),
    [REFERRAL_PROVIDER_INDICATOR_FQN.getName()]: data.getIn([REFERRAL_PROVIDER_INDICATOR_FQN.toString(), 0]),
    [STABILIZED_INDICATOR_FQN.getName()]: data.getIn([STABILIZED_INDICATOR_FQN.toString(), 0]),
    [TRANSPORTING_AGENCY_FQN.getName()]: data.getIn([TRANSPORTING_AGENCY_FQN.toString(), 0]),
    [VOLUNTARY_ACTION_INDICATOR_FQN.getName()]: data.getIn([VOLUNTARY_ACTION_INDICATOR_FQN.toString(), 0]),
  };

  // special cases
  result[DISPOSITION_FQN.getName()] = data.get(DISPOSITION_FQN.toString(), List()).toJS();
  result[DEESCALATION_TECHNIQUES_FQN.getName()] = data.get(DEESCALATION_TECHNIQUES_FQN.toString(), List()).toJS();
  result[SPECIAL_RESOURCES_CALLED_FQN.getName()] = data.get(SPECIAL_RESOURCES_CALLED_FQN.toString(), List()).toJS();

  return result;
}

function gatherOfficerData(data :Map<*, *>) :{[key :string] :any} {

  const result = {
    [OFFICER_NAME_FQN.getName()]: data.getIn([OFFICER_NAME_FQN.toString(), 0]),
    [OFFICER_SEQ_ID_FQN.getName()]: data.getIn([OFFICER_SEQ_ID_FQN.toString(), 0]),
    [OFFICER_INJURIES_FQN.getName()]: data.getIn([OFFICER_INJURIES_FQN.toString(), 0]),
  };

  // special cases
  result[OFFICER_CERTIFICATION_FQN.getName()] = data.get(OFFICER_CERTIFICATION_FQN.toString(), List()).toJS();

  return result;
}

class HackyBehavioralHealthReportViewContainer extends Component<Props> {

  renderReport = () => {

    const { selectedOrganizationId, selectedReportData } = this.props;

    // TODO: this all has to be rewritten
    return (
      <>
        <div>
          <h1>Report</h1>
          <ReportInfoView
              input={gatherReportData(selectedReportData)}
              isInReview
              selectedOrganizationId={selectedOrganizationId} />
        </div>
        <div>
          <h1>Consumer</h1>
          <ConsumerInfoView
              input={gatherConsumerData(selectedReportData)}
              isInReview
              selectedOrganizationId={selectedOrganizationId} />
        </div>
        <div>
          <h1>Complainant</h1>
          <ComplainantInfoView
              input={gatherComplainantData(selectedReportData)}
              isInReview
              selectedOrganizationId={selectedOrganizationId} />
        </div>
        <div>
          <h1>Disposition</h1>
          <DispositionView
              input={gatherDispositionData(selectedReportData)}
              isInReview
              selectedOrganizationId={selectedOrganizationId} />
        </div>
        <div>
          <h1>Officer</h1>
          <OfficerInfoView
              input={gatherOfficerData(selectedReportData)}
              isInReview
              selectedOrganizationId={selectedOrganizationId} />
        </div>
      </>
    );
  }

  render() {

    const { isFetchingReportInFull, selectedReportEntityKeyId } = this.props;

    if (!selectedReportEntityKeyId) {
      return <Redirect to={REPORTS_PATH} />;
    }

    if (isFetchingReportInFull) {
      return <Spinner />;
    }

    // TODO: still need to handle other types of reports, not just the BHR

    return (
      <ContentContainerOuterWrapper>
        <ContentContainerInnerWrapper>
          <StyledCard>
            { this.renderReport() }
          </StyledCard>
        </ContentContainerInnerWrapper>
      </ContentContainerOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganizationId']);

  const bhrEntitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.toString(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  return {
    selectedOrganizationId,
    entitySetIds: {
      [BEHAVIORAL_HEALTH_REPORT_FQN.toString()]: bhrEntitySetId
    },
    isFetchingReportInFull: state.getIn(['reports', 'isFetchingReportInFull']),
    reports: state.getIn(['reports', 'reports'], List()),
    selectedReportEntityKeyId: state.getIn(['reports', 'selectedReportEntityKeyId'], ''),
    selectedReportData: state.getIn(['reports', 'selectedReportData'], Map()),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ getReports }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HackyBehavioralHealthReportViewContainer);
