// @flow

import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import styled, { css } from 'styled-components';
import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Breadcrumbs,
  Button,
  CardStack,
  Hooks,
  IconSplash,
  StyleUtils,
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import AppearancePanel from './AppearancePanel';
import AssignedOfficerPanel from './AssignedOfficerPanel';
import ContactPanel from './ContactPanel';
import CovidBanner from './CovidBanner';
import HistoryBody from './HistoryBody';
import NewResponsePlanCard from './NewResponsePlanCard';
import PortraitCard from './PortraitCard';

import ContactCarousel from '../../../components/premium/contacts/ContactCarousel';
import CreateIssueButton from '../../../components/buttons/CreateIssueButton';
import LinkButton from '../../../components/buttons/LinkButton';
import ReportSelectionModal from '../../people/ReportSelectionModal';
import * as FQN from '../../../edm/DataModelFqns';
import { BreadcrumbItem, BreadcrumbLink } from '../../../components/breadcrumbs';
import { useAuthorization, usePeopleRoute } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import {
  BASIC_PATH,
  EDIT_PATH,
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
} from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';
import { getAuthorization } from '../../../core/sagas/authorize/AuthorizeActions';
import { getLBProfile } from '../../../longbeach/profile/LongBeachProfileActions';
import { getImageDataFromEntity } from '../../../utils/BinaryUtils';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { getFirstLastFromPerson } from '../../../utils/PersonUtils';
import { reduceRequestStates } from '../../../utils/StateUtils';
import { getAllSymptomsReports } from '../../reports/symptoms/SymptomsReportActions';
import { getProfileReports } from '../ProfileActions';
import { getIncidentReportsSummary } from '../actions/ReportActions';
import { getAboutPlan } from '../edit/about/AboutActions';
import { getBasicInformation } from '../edit/basicinformation/actions/BasicInformationActions';
import { getContacts } from '../edit/contacts/EmergencyContactsActions';
import { getOfficerSafety } from '../edit/officersafety/OfficerSafetyActions';
import { getResponsePlan } from '../edit/responseplan/ResponsePlanActions';
import type { RoutingAction } from '../../../core/router/RoutingActions';

const { media } = StyleUtils;
const { useBoolean } = Hooks;

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
`;

const TabGroup = styled.div`
  margin-right: auto;
  button:first-of-type {
    border-radius: 3px 0 0 3px;
  }
  button:last-of-type {
    border-radius: 0 3px 3px 0;
  }
`;

const getActiveStyles = ({ active }) => {
  if (active) {
    return css`
      background-color: #A6AAB2;
      border-color: #A6AAB2;
      color: #fff;

      :hover {
        background-color: #A6AAB2;
        border-color: #A6AAB2;
        color: #fff;
      }
    `;
  }
  return null;
};

const TabButton = styled(Button)`
  background-color: #E5E5F0;
  border-color: #E5E5F0;
  border-radius: 0;
  ${getActiveStyles};
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.25fr;
  grid-gap: 20px;
  ${media.phone`
    grid-template-columns: 1fr;
  `}
`;

const ScrollStack = styled(CardStack)`
  overflow-x: auto;
`;

const BreadcrumbWrapper = styled.div`
  padding: 8px;
`;

const ActionBar = styled.div`
  display: flex;
  ${media.tablet`
    flex-direction: column;
  `}
`;

const ButtonGroup = styled.div`
  margin-left: auto;
  button:not(:last-child) {
    margin-right: 10px;
  }
`;

const StyledLinkButton = styled(LinkButton)`
  background-color: #E5E5F0;
  border-color: #E5E5F0;
  padding: 10px;
`;

type Props = {
  actions :{
    getAboutPlan :RequestSequence;
    getAllSymptomsReports :RequestSequence;
    getAuthorization :RequestSequence;
    getBasicInformation :RequestSequence;
    getContacts :RequestSequence;
    getIncidentReportsSummary :RequestSequence;
    getLBProfile :RequestSequence;
    getOfficerSafety :RequestSequence;
    getProfileReports :RequestSequence;
    getResponsePlan :RequestSequence;
    goToPath :(path :string) => RoutingAction;
  };
  address :Map;
  appearance :Map;
  behaviorSummary :List<Map>;
  contact :Map;
  contactInfoByContactEKID :Map;
  crisisSummary :Map;
  emergencyContacts :List<Map>;
  fetchAboutPlanState :RequestState;
  fetchAboutState :RequestState;
  fetchOfficerSafetyState :RequestState;
  fetchReportsState :RequestState;
  fetchResponsePlanState :RequestState;
  fetchStayAwayState :RequestState;
  interactionStrategies :List<Map>;
  isContactForByContactEKID :Map;
  officerSafety :List<Map>;
  photo :Map;
  probation :Map;
  recentSymptoms :boolean;
  reports :List<Map>;
  responsePlan :Map;
  responsibleUser :Map;
  safetySummary :List<Map>;
  scars :Map;
  selectedPerson :Map;
  stayAwayLocation :Map;
  triggers :List<Map>;
  warrant :Map;
};

const PremiumProfileContainer = (props :Props) => {

  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, []);

  const {
    actions,
    address,
    appearance,
    behaviorSummary,
    contact,
    contactInfoByContactEKID,
    crisisSummary,
    emergencyContacts,
    fetchAboutPlanState,
    fetchAboutState,
    fetchOfficerSafetyState,
    fetchReportsState,
    fetchResponsePlanState,
    fetchStayAwayState,
    interactionStrategies,
    isContactForByContactEKID,
    officerSafety,
    photo,
    probation,
    recentSymptoms,
    reports,
    responsePlan,
    responsibleUser,
    safetySummary,
    scars,
    selectedPerson,
    stayAwayLocation,
    triggers,
    warrant,
  } = props;

  const match = useRouteMatch();
  const [isVisible, open, close] = useBoolean();
  usePeopleRoute(actions.getAboutPlan);
  usePeopleRoute(actions.getBasicInformation);
  usePeopleRoute(actions.getContacts);
  usePeopleRoute(actions.getOfficerSafety);
  usePeopleRoute(actions.getResponsePlan);
  usePeopleRoute(actions.getProfileReports);
  // usePeopleRoute(actions.getIncidentReportsSummary);
  usePeopleRoute(actions.getLBProfile);
  usePeopleRoute(actions.getAllSymptomsReports);

  const [tab, setTab] = useState('response');
  const [isAuthorized] = useAuthorization('profile', actions.getAuthorization);
  const isLoadingIntro = fetchAboutState !== RequestStates.SUCCESS;
  const isLoadingAboutPlan = fetchAboutPlanState !== RequestStates.SUCCESS;

  const isLoadingBody = reduceRequestStates([
    fetchOfficerSafetyState,
    fetchReportsState,
    fetchResponsePlanState,
    fetchStayAwayState,
  ]) === RequestStates.PENDING;

  const imageURL :string = useMemo(() => getImageDataFromEntity(photo), [photo]);
  const name = getFirstLastFromPerson(selectedPerson);
  const subjectEKID = getEntityKeyId(selectedPerson);
  const numReportsFoundIn = selectedPerson.getIn([FQN.NUM_REPORTS_FOUND_IN_FQN, 0], 0);
  const profilePath = PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, subjectEKID);

  let body = (
    <>
      <NewResponsePlanCard
          isLoading={isLoadingBody}
          officerSafety={officerSafety}
          triggers={triggers}
          interactionStrategies={interactionStrategies} />
      <ContactCarousel
          isLoading={isLoadingBody}
          contacts={emergencyContacts}
          contactInfoByContactEKID={contactInfoByContactEKID}
          isContactForByContactEKID={isContactForByContactEKID} />
    </>
  );

  // TODO use React Router for this
  if (tab === 'history') {
    body = (
      <HistoryBody
          behaviorSummary={behaviorSummary}
          safetySummary={safetySummary}
          crisisSummary={crisisSummary}
          isLoading={isLoadingBody}
          reports={reports}
          responsePlan={responsePlan}
          contacts={emergencyContacts}
          contactInfoByContactEKID={contactInfoByContactEKID}
          isContactForByContactEKID={isContactForByContactEKID}
          stayAwayLocation={stayAwayLocation}
          probation={probation}
          warrant={warrant} />
    );
  }

  return (
    <ContentOuterWrapper>
      <CovidBanner recentSymptoms={recentSymptoms} />
      <ContentWrapper>
        <ProfileGrid>
          <Aside>
            <CardStack>
              <BreadcrumbWrapper>
                <Breadcrumbs>
                  <BreadcrumbLink to={profilePath}>{name}</BreadcrumbLink>
                  <BreadcrumbItem>profile</BreadcrumbItem>
                </Breadcrumbs>
              </BreadcrumbWrapper>
              <PortraitCard isLoading={isLoadingIntro} imageUrl={imageURL} person={selectedPerson} />
              <AppearancePanel
                  isLoading={isLoadingIntro}
                  appearance={appearance}
                  scars={scars}
                  selectedPerson={selectedPerson} />
              <ContactPanel address={address} contact={contact} isLoading={isLoadingIntro} />
              <AssignedOfficerPanel
                  responsibleUser={responsibleUser}
                  isLoading={isLoadingAboutPlan} />
            </CardStack>
          </Aside>
          <ScrollStack>
            <ActionBar>
              <TabGroup>
                <TabButton
                    active={tab === 'response'}
                    name="response-btn"
                    type="button"
                    onClick={() => setTab('response')}>
                  Response
                </TabButton>
                <TabButton
                    active={tab === 'history'}
                    name="history-btn"
                    type="button"
                    onClick={() => setTab('history')}>
                  History
                </TabButton>
              </TabGroup>
              <ButtonGroup>
                {
                  isAuthorized && (
                    <StyledLinkButton to={`${match.url}${EDIT_PATH}${BASIC_PATH}`}>
                      <FontAwesomeIcon icon={faPen} />
                    </StyledLinkButton>
                  )
                }
                <CreateIssueButton />
                <Button mode="primary" onClick={open}>Create Report</Button>
                <ReportSelectionModal
                    selectedPerson={selectedPerson}
                    isVisible={isVisible}
                    onClose={close} />
              </ButtonGroup>

            </ActionBar>
            {
              // show splash based on report number from person, rather than successful neighbor returns.
              !numReportsFoundIn && !isLoadingBody
                ? <IconSplash icon={faFolderOpen} caption="No reports have been filed." />
                : body
            }
          </ScrollStack>
        </ProfileGrid>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

const mapStateToProps = (state :Map) => {
  const fetchAboutStates = [
    state.getIn(['profile', 'basicInformation', 'basics', 'fetchState']),
    state.getIn(['profile', 'basicInformation', 'appearance', 'fetchState']),
    state.getIn(['profile', 'basicInformation', 'scars', 'fetchState']),
    state.getIn(['profile', 'basicInformation', 'address', 'fetchState']),
  ];

  const fetchOfficerSafetyStates = [
    state.getIn(['profile', 'officerSafety', 'fetchState']),
    state.getIn(['profile', 'reports', 'fetchState'])
  ];

  return {
    address: state.getIn(['profile', 'basicInformation', 'address', 'data'], Map()),
    appearance: state.getIn(['profile', 'basicInformation', 'appearance', 'data'], Map()),
    behaviorSummary: state.getIn(['profile', 'reports', 'behaviorSummary'], List()),
    contact: state.getIn(['profile', 'basicInformation', 'contact', 'data'], Map()),
    contactInfoByContactEKID: state.getIn(['profile', 'emergencyContacts', 'data', 'contactInfoByContactEKID'], Map()),
    emergencyContacts: state.getIn(['profile', 'emergencyContacts', 'data', 'contacts'], List()),
    crisisSummary: state.getIn(['profile', 'reports', 'crisisSummary'], Map()),
    fetchAboutPlanState: state.getIn(['profile', 'about', 'fetchState'], RequestStates.STANDBY),
    fetchAboutState: reduceRequestStates(fetchAboutStates),
    fetchOfficerSafetyState: reduceRequestStates(fetchOfficerSafetyStates),
    fetchReportsState: state.getIn(['profile', 'reports', 'fetchState'], RequestStates.STANDBY),
    fetchResponsePlanState: state.getIn(['profile', 'responsePlan', 'fetchState'], RequestStates.STANDBY),
    fetchStayAwayState: state.getIn(['longBeach', 'profile', 'fetchState'], RequestStates.STANDBY),
    interactionStrategies: state.getIn(['profile', 'responsePlan', 'interactionStrategies'], List()),
    isContactForByContactEKID: state.getIn(['profile', 'emergencyContacts', 'data', 'isContactForByContactEKID'], Map()),
    lastIncident: state.getIn(['profile', 'reports', 'lastIncident'], Map()),
    officerSafety: state.getIn(['profile', 'officerSafety', 'data', 'officerSafetyConcerns'], List()),
    photo: state.getIn(['profile', 'basicInformation', 'photos', 'data'], Map()),
    probation: state.getIn(['longBeach', 'profile', 'probation']),
    recentSymptoms: state.getIn(['profile', 'symptomReports', 'recentSymptoms']),
    reports: state.getIn(['profile', 'reports', 'data'], List()),
    responsePlan: state.getIn(['profile', 'responsePlan', 'data'], Map()),
    responsibleUser: state.getIn(['profile', 'about', 'data'], Map()),
    safetySummary: state.getIn(['profile', 'reports', 'safetySummary'], List()),
    scars: state.getIn(['profile', 'basicInformation', 'scars', 'data'], Map()),
    selectedPerson: state.getIn(['profile', 'basicInformation', 'basics', 'data'], Map()),
    stayAwayLocation: state.getIn(['longBeach', 'profile', 'stayAwayLocation']),
    symptoms: state.getIn(['profile', 'symptomReports', 'data']),
    techniques: state.getIn(['profile', 'officerSafety', 'data', 'interactionStrategies'], List()),
    triggers: state.getIn(['profile', 'officerSafety', 'data', 'behaviors'], List()),
    warrant: state.getIn(['longBeach', 'profile', 'warrant']),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getAboutPlan,
    getAllSymptomsReports,
    getAuthorization,
    getBasicInformation,
    getContacts,
    getIncidentReportsSummary,
    getLBProfile,
    getOfficerSafety,
    getProfileReports,
    getResponsePlan,
    goToPath,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PremiumProfileContainer);
