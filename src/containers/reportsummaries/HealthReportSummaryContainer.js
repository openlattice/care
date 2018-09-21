import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, List, fromJS, toJS } from 'immutable';

import ReportInfoView from '../../components/ReportInfoView';
import ConsumerInfoView from '../../components/ConsumerInfoView';
import ComplainantInfoView from '../../components/ComplainantInfoView';
import DispositionView from '../../components/DispositionView';
import OfficerInfoView from '../../components/OfficerInfoView';
import { searchConsumerNeighbors } from '../search/SearchActionFactory';
import {
  APP_TYPES_FQNS,
  PERSON,
  REPORT_INFO,
  CONSUMER_INFO,
  COMPLAINANT_INFO,
  DISPOSITION_INFO,
  OFFICER_INFO,
  ENTITY_ID
} from '../../shared/Consts';
import { SectionWrapper, ContentWrapper, SectionHeader } from '../../shared/Layout';

const SummarySectionHeader = SectionHeader.extend`
  margin-top: 50px;
`;

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


class HealthReportSummaryContainer extends React.Component {
  componentWillMount() {
    const reportEntityId = this.props.selectedReport.getIn([ENTITY_ID, 0], '');
    this.props.actions.searchConsumerNeighbors({
      entitySetId: this.props.bhrEntitySetId,
      entityId: reportEntityId
    });
  }

  render() {
    const { selectedReport, consumerNeighborDetails } = this.props;

    const reportInfo = {
      dispatchReason: selectedReport.getIn([REPORT_INFO.DISPATCH_REASON_FQN, 0], ''),
      complaintNumber: selectedReport.getIn([REPORT_INFO.COMPLAINT_NUMBER_FQN, 0], ''),
      companionOffenseReport: selectedReport.getIn([REPORT_INFO.COMPANION_OFFENSE_REPORT_FQN, 0], null),
      incident: selectedReport.getIn([REPORT_INFO.INCIDENT_FQN, 0], ''),
      locationOfIncident: selectedReport.getIn([REPORT_INFO.LOCATION_OF_INCIDENT_FQN, 0], ''),
      unit: selectedReport.getIn([REPORT_INFO.UNIT_FQN, 0], ''),
      postOfOccurrence: selectedReport.getIn([REPORT_INFO.POST_OF_OCCURRENCE_FQN, 0], ''),
      cadNumber: selectedReport.getIn([REPORT_INFO.CAD_NUMBER_FQN, 0], ''),
      onView: selectedReport.getIn([REPORT_INFO.ON_VIEW_FQN, 0], null),
      dateOccurred: selectedReport.getIn([REPORT_INFO.DATE_OCCURRED_FQN, 0], ''),
      timeOccurred: selectedReport.getIn([REPORT_INFO.TIME_OCCURRED_FQN, 0], ''),
      dateReported: selectedReport.getIn([REPORT_INFO.DATE_REPORTED_FQN, 0], ''),
      timeReported: selectedReport.getIn([REPORT_INFO.TIME_REPORTED_FQN, 0], ''),
    };

    const consumerInfo = {
      firstName: consumerNeighborDetails && consumerNeighborDetails.getIn([PERSON.FIRST_NAME_FQN, 0], ''),
      lastName: consumerNeighborDetails && consumerNeighborDetails.getIn([PERSON.LAST_NAME_FQN, 0], ''),
      middleName: consumerNeighborDetails && consumerNeighborDetails.getIn([PERSON.MIDDLE_NAME_FQN, 0], ''),
      address: selectedReport.getIn([CONSUMER_INFO.ADDRESS_FQN, 0], ''),
      phone: selectedReport.getIn([CONSUMER_INFO.PHONE_FQN, 0], ''),
      identification: selectedReport.getIn([PERSON.ID_FQN, 0], ''),
      militaryStatus: selectedReport.getIn([CONSUMER_INFO.MILITARY_STATUS_FQN, 0], ''),
      gender: selectedReport.getIn([CONSUMER_INFO.GENDER_FQN, 0], ''),
      race: selectedReport.getIn([CONSUMER_INFO.RACE_FQN, 0], ''),
      age: selectedReport.getIn([CONSUMER_INFO.AGE_FQN, 0], ''),
      dob: selectedReport.getIn([CONSUMER_INFO.DOB_FQN, 0], ''),
      homeless: selectedReport.getIn([CONSUMER_INFO.HOMELESS_FQN, 0], null),
      homelessLocation: selectedReport.getIn([CONSUMER_INFO.HOMELESS_LOCATION_FQN, 0], ''),
      drugsAlcohol: selectedReport.getIn([CONSUMER_INFO.DRUGS_ALCOHOL_FQN, 0], ''),
      drugType: selectedReport.getIn([CONSUMER_INFO.DRUG_TYPE_FQN, 0], ''),
      prescribedMedication: selectedReport.getIn([CONSUMER_INFO.PRESCRIBED_MEDICATION_FQN, 0], ''),
      takingMedication: selectedReport.getIn([CONSUMER_INFO.TAKING_MEDICATION_FQN, 0], null),
      prevPsychAdmission: selectedReport.getIn([CONSUMER_INFO.PREV_PSYCH_ADMISSION_FQN, 0], null),
      selfDiagnosis: selectedReport.get(CONSUMER_INFO.SELF_DIAGNOSIS_FQN, List()),
      selfDiagnosisOther: selectedReport.getIn([CONSUMER_INFO.SELF_DIAGNOSIS_FQN, 0], ''),
      armedWithWeapon: selectedReport.getIn([CONSUMER_INFO.ARMED_WITH_WEAPON_FQN, 0], null),
      armedWeaponType: selectedReport.getIn([CONSUMER_INFO.ARMED_WEAPON_TYPE_FQN, 0], ''),
      accessToWeapons: selectedReport.getIn([CONSUMER_INFO.ACCESS_TO_WEAPONS_FQN, 0], null),
      accessibleWeaponType: selectedReport.getIn([CONSUMER_INFO.ACCESSIBLE_WEAPON_TYPE_FQN, 0], ''),
      observedBehaviors: selectedReport.get(CONSUMER_INFO.OBSERVED_BEHAVIORS_FQN, List()),
      observedBehaviorsOther: selectedReport.getIn([CONSUMER_INFO.OBVSERVED_BEHAVIORS_OTHER_FQN, 0], ''),
      emotionalState: selectedReport.get(CONSUMER_INFO.EMOTIONAL_STATE_FQN, List()),
      emotionalStateOther: selectedReport.getIn([CONSUMER_INFO.EMOTIONAL_STATE_OTHER_FQN, 0], ''),
      photosTakenOf: selectedReport.get(CONSUMER_INFO.PHOTOS_TAKEN_OF_FQN, List()),
      injuries: selectedReport.get(CONSUMER_INFO.INJURIES_FQN, List()),
      injuriesOther: selectedReport.getIn([CONSUMER_INFO.INJURIES_OTHER_FQN, 0], ''),
      suicidal: selectedReport.getIn([CONSUMER_INFO.SUICIDAL_FQN, 0], null),
      suicidalActions: selectedReport.get(CONSUMER_INFO.SUICIDAL_ACTIONS_FQN, List()),
      suicideAttemptMethod: selectedReport.get(CONSUMER_INFO.SUICIDE_ATTEMPT_METHOD_FQN, List()),
      suicideAttemptMethodOther: selectedReport.getIn([CONSUMER_INFO.SUICIDE_ATTEMPT_METHOD_OTHER_FQN, 0], '')
    };

    const complainantInfo = {
      complainantName: selectedReport.getIn([COMPLAINANT_INFO.COMPLAINANT_NAME_FQN, 0], ''),
      complainantAddress: selectedReport.getIn([COMPLAINANT_INFO.COMPLAINANT_ADDRESS_FQN, 0], ''),
      complainantConsumerRelationship: selectedReport.getIn([COMPLAINANT_INFO.COMPLAINANT_CONSUMER_RELATIONSHIP_FQN, 0], ''),
      complainantPhone: selectedReport.getIn([COMPLAINANT_INFO.COMPLAINANT_PHONE_FQN, 0], '')
    };

    const dispositionInfo = {
      disposition: selectedReport.get(DISPOSITION_INFO.DISPOSITION_FQN, List()),
      hospitalTransport: selectedReport.getIn([DISPOSITION_INFO.HOSPITAL_TRANSPORT_FQN, 0], null),
      hospital: selectedReport.getIn([DISPOSITION_INFO.HOSPITAL_FQN, 0], ''),
      deescalationTechniques: selectedReport.get(DISPOSITION_INFO.DEESCALATION_TECHNIQUES_FQN, List()),
      deescalationTechniquesOther: selectedReport.getIn([DISPOSITION_INFO.DEESCALATION_TECHNIQUES_OTHER_FQN, 0], ''),
      specializedResourcesCalled: selectedReport.get(DISPOSITION_INFO.SPECIALIZED_RESOURCES_CALLED_FQN, List()),
      incidentNarrative: selectedReport.getIn([DISPOSITION_INFO.INCIDENT_NARRATIVE_FQN, 0], '')
    };

    const officerInfo = {
      officerName: selectedReport.getIn([OFFICER_INFO.OFFICER_NAME_FQN, 0], ''),
      officerSeqID: selectedReport.getIn([OFFICER_INFO.OFFICER_SEQ_ID_FQN, 0], ''),
      officerInjuries: selectedReport.getIn([OFFICER_INFO.OFFICER_INJURIES_FQN, 0], ''),
      officerCertification: selectedReport.get(OFFICER_INFO.OFFICER_CERTIFICATION_FQN, List())
    };


    return (
      <SectionWrapper>
        <SummarySectionHeader>Health Report Summary</SummarySectionHeader>
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

  static propTypes = {
    selectedReport: PropTypes.object.isRequired,
    consumerNeighborDetails: PropTypes.object.isRequired,
    bhrEntitySetId: PropTypes.string.isRequired,
    actions: PropTypes.shape({
      searchConsumerNeighbors: PropTypes.func.isRequired
    })
  };
};

function mapStateToProps(state :Map<*, *>) :Object {
  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganization'], '');

  const bhrEntitySetId :string = state.getIn([
    'app',
    BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ], '');

  const consumerNeighborDetails = state.getIn(['search', 'consumerNeighbors', 'searchResults', 0, 'neighborDetails'], Map());

  return {
    bhrEntitySetId,
    consumerNeighborDetails
  };
};

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ searchConsumerNeighbors }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthReportSummaryContainer);