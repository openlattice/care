import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, fromJS, toJS } from 'immutable';

import ReportInfoView from '../../components/ReportInfoView';
import ConsumerInfoView from '../../components/ConsumerInfoView';
import ComplainantInfoView from '../../components/ComplainantInfoView';
import DispositionView from '../../components/DispositionView';
import OfficerInfoView from '../../components/OfficerInfoView';
import { getBHRReportData } from './ConsumerSummaryActionFactory';
import { REQUEST_STATUSES } from './ConsumerSummaryReducer';
import {
  APP_TYPES_FQNS,
  PERSON,
  REPORT_INFO,
  CONSUMER_INFO,
  COMPLAINANT_INFO,
  DISPOSITION_INFO,
  OFFICER_INFO
} from '../../shared/Consts';
import { SectionWrapper, ContentWrapper, SectionHeader } from '../../shared/Layout';


const SectionHeaderWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SectionTitle = styled.span`
  font-size: 28px;
  margin-right: 10px;
`;

const Section = styled.div`
  margin-bottom: 60px;
`;


const {
  BEHAVIORAL_HEALTH_REPORT_FQN
} = APP_TYPES_FQNS;


class bhrFormSummaryContainer extends React.Component {
  componentWillMount() {
    console.log('selectedreport props:', this.props.selectedReport.toJS());
  }

  render() {
    const { selectedReport } = this.props;

    const reportInfo = {
      dispatchReason: selectedReport.getIn([REPORT_INFO.DISPATCH_REASON_FQN, 0]),
      complaintNumber: selectedReport.getIn([REPORT_INFO.COMPLAINT_NUMBER_FQN, 0]),
      companionOffenseReport: selectedReport.getIn([REPORT_INFO.COMPANION_OFFENSE_REPORT_FQN, 0]),
      incident: selectedReport.getIn([REPORT_INFO.INCIDENT_FQN, 0]),
      locationOfIncident: selectedReport.getIn([REPORT_INFO.LOCATION_OF_INCIDENT_FQN, 0]),
      unit: selectedReport.getIn([REPORT_INFO.UNIT_FQN, 0]),
      postOfOccurrence: selectedReport.getIn([REPORT_INFO.POST_OF_OCCURRENCE_FQN, 0]),
      cadNumber: selectedReport.getIn([REPORT_INFO.CAD_NUMBER_FQN, 0]),
      onView: selectedReport.getIn([REPORT_INFO.ON_VIEW_FQN, 0]),
      dateOccurred: selectedReport.getIn([REPORT_INFO.DATE_OCCURRED_FQN, 0]),
      timeOccurred: selectedReport.getIn([REPORT_INFO.TIME_OCCURRED_FQN, 0]),
      dateReported: selectedReport.getIn([REPORT_INFO.DATE_REPORTED_FQN, 0]),
      timeReported: selectedReport.getIn([REPORT_INFO.TIME_REPORTED_FQN, 0]),
    };

    const consumerInfo = {
      firstName: selectedReport.getIn([PERSON.FIRST_NAME_FQN, 0]),
      lastName: selectedReport.getIn([PERSON.LAST_NAME_FQN, 0]),
      middleName: selectedReport.getIn([PERSON.MIDDLE_NAME_FQN, 0]),
      address: selectedReport.getIn([CONSUMER_INFO.ADDRESS_FQN, 0]),
      phone: selectedReport.getIn([CONSUMER_INFO.PHONE_FQN, 0]),
      identification: selectedReport.getIn([PERSON.ID_FQN, 0]),
      militaryStatus: selectedReport.getIn([CONSUMER_INFO.MILITARY_STATUS_FQN, 0]),
      gender: selectedReport.getIn([CONSUMER_INFO.GENDER_FQN, 0]),
      race: selectedReport.getIn([CONSUMER_INFO.RACE_FQN, 0]),
      age: selectedReport.getIn([CONSUMER_INFO.AGE_FQN, 0]),
      dob: selectedReport.getIn([CONSUMER_INFO.DOB_FQN, 0]),
      homeless: selectedReport.getIn([CONSUMER_INFO.HOMELESS_FQN, 0]),
      homelessLocation: selectedReport.getIn([CONSUMER_INFO.HOMELESS_LOCATION_FQN, 0]),
      drugsAlcohol: selectedReport.getIn([CONSUMER_INFO.DRUGS_ALCOHOL_FQN, 0]),
      drugType: selectedReport.getIn([CONSUMER_INFO.DRUG_TYPE_FQN, 0]),
      prescribedMedication: selectedReport.getIn([CONSUMER_INFO.PRESCRIBED_MEDICATION_FQN, 0]),
      takingMedication: selectedReport.getIn([CONSUMER_INFO.TAKING_MEDICATION_FQN, 0]),
      prevPsychAdmission: selectedReport.getIn([CONSUMER_INFO.PREV_PSYCH_ADMISSION_FQN, 0]),
      selfDiagnosis: selectedReport.get(CONSUMER_INFO.SELF_DIAGNOSIS_FQN),
      selfDiagnosisOther: selectedReport.getIn([CONSUMER_INFO.SELF_DIAGNOSIS_FQN, 0]),
      armedWithWeapon: selectedReport.getIn([CONSUMER_INFO.ARMED_WITH_WEAPON_FQN, 0]),
      armedWeaponType: selectedReport.getIn([CONSUMER_INFO.ARMED_WEAPON_TYPE_FQN, 0]),
      accessToWeapons: selectedReport.getIn([CONSUMER_INFO.ACCESS_TO_WEAPONS_FQN, 0]),
      accessibleWeaponType: selectedReport.getIn([CONSUMER_INFO.ACCESSIBLE_WEAPON_TYPE_FQN, 0]),
      observedBehaviors: selectedReport.get(CONSUMER_INFO.OBSERVED_BEHAVIORS_FQN),
      observedBehaviorsOther: selectedReport.getIn([CONSUMER_INFO.OBVSERVED_BEHAVIORS_OTHER_FQN, 0]),
      emotionalState: selectedReport.get(CONSUMER_INFO.EMOTIONAL_STATE_FQN),
      emotionalStateOther: selectedReport.getIn([CONSUMER_INFO.EMOTIONAL_STATE_OTHER_FQN, 0]),
      photosTakenOf: selectedReport.getIn([CONSUMER_INFO.PHOTOS_TAKEN_OF_FQN, 0]),
      injuries: selectedReport.get(CONSUMER_INFO.INJURIES_FQN),
      injuriesOther: selectedReport.getIn([CONSUMER_INFO.INJURIES_OTHER_FQN, 0]),
      suicidal: selectedReport.getIn([CONSUMER_INFO.SUICIDAL_FQN, 0]),
      suicidalActions: selectedReport.getIn([CONSUMER_INFO.SUICIDAL_ACTIONS_FQN, 0]),
      suicideAttemptMethod: selectedReport.get(CONSUMER_INFO.SUICIDE_ATTEMPT_METHOD_FQN),
      suicideAttemptMethodOther: selectedReport.getIn([CONSUMER_INFO.SUICIDE_ATTEMPT_METHOD_OTHER_FQN, 0])
    };

    const complainantInfo = {
      complainantName: selectedReport.getIn([COMPLAINANT_INFO.COMPLAINANT_NAME_FQN, 0]),
      complainantAddress: selectedReport.getIn([COMPLAINANT_INFO.COMPLAINANT_ADDRESS_FQN, 0]),
      complainantConsumerRelationship: selectedReport.getIn([COMPLAINANT_INFO.COMPLAINANT_CONSUMER_RELATIONSHIP_FQN, 0]),
      complainantPhone: selectedReport.getIn([COMPLAINANT_INFO.COMPLAINANT_PHONE_FQN, 0])
    };

    const dispositionInfo = {
      disposition: selectedReport.get(DISPOSITION_INFO.DISPOSITION_FQN),
      hospitalTransport: selectedReport.getIn([DISPOSITION_INFO.HOSPITAL_TRANSPORT_FQN, 0]),
      hospital: selectedReport.getIn([DISPOSITION_INFO.HOSPITAL_FQN, 0]),
      deescalationTechniques: selectedReport.get(DISPOSITION_INFO.DEESCALATION_TECHNIQUES_FQN),
      deescalationTechniquesOther: selectedReport.getIn([DISPOSITION_INFO.DEESCALATION_TECHNIQUES_OTHER_FQN, 0]),
      specializedResourcesCalled: selectedReport.get(DISPOSITION_INFO.SPECIALIZED_RESOURCES_CALLED_FQN),
      incidentNarrative: selectedReport.getIn([DISPOSITION_INFO.INCIDENT_NARRATIVE_FQN, 0])
    };

    const officerInfo = {
      officerName: selectedReport.getIn([OFFICER_INFO.OFFICER_NAME_FQN, 0]),
      officerSeqID: selectedReport.getIn([OFFICER_INFO.OFFICER_SEQ_ID_FQN, 0]),
      officerInjuries: selectedReport.getIn([OFFICER_INFO.OFFICER_INJURIES_FQN, 0]),
      officerCertification: selectedReport.get(OFFICER_INFO.OFFICER_CERTIFICATION_FQN)
    };


    return (
      <SectionWrapper>
        <SectionHeader>Health Report Summary</SectionHeader>
        <ContentWrapper>
          <Section>
            <SectionHeaderWrapper>
              <SectionTitle>Report Info</SectionTitle>
            </SectionHeaderWrapper>
            <ReportInfoView
                input={reportInfo}
                isInReview={() => true} />
          </Section>
          <Section>
            <SectionHeaderWrapper>
              <SectionTitle>Consumer</SectionTitle>
            </SectionHeaderWrapper>
            <ConsumerInfoView
                input={consumerInfo}
                isInReview={() => true} />
          </Section>
          <Section>
            <SectionHeaderWrapper>
              <SectionTitle>Complainant</SectionTitle>
            </SectionHeaderWrapper>
            <ComplainantInfoView
                input={complainantInfo}
                isInReview={() => true} />
          </Section>
          <Section>
            <SectionHeaderWrapper>
              <SectionTitle>Disposition</SectionTitle>
            </SectionHeaderWrapper>
            <DispositionView
                input={dispositionInfo}
                isInReview={() => true} />
          </Section>
          <Section>
            <SectionHeaderWrapper>
              <SectionTitle>Officer</SectionTitle>
            </SectionHeaderWrapper>
            <OfficerInfoView
                input={officerInfo}
                isInReview={() => true} />
          </Section>
        </ContentWrapper>
      </SectionWrapper>
    );
  }
};

export default bhrFormSummaryContainer;