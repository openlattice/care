// @flow
import React, { useCallback } from 'react';

import styled from 'styled-components';
import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { List, Map } from 'immutable';
import { IconSplash, SearchResults, StyleUtils } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import BackgroundInformationCard from './BackgroundInformationCard';
import BehaviorCard from './BehaviorCard';
import OfficerSafetyCard from './OfficerSafetyCard';
import ReportsSummary from './ReportsSummary';

import ContactCarousel from '../../../components/premium/contacts/ContactCarousel';
import CrisisCountCard from '../CrisisCountCard';
import ProbationCard from '../../../components/premium/probation/ProbationCard';
import ProfileResult from '../ProfileResult';
import RecentIncidentCard from '../RecentIncidentCard';
import StayAwayCard from '../../../components/premium/stayaway/StayAwayCard';
import WarrantCard from '../../../components/premium/warrant/WarrantCard';
import { useAppSettings } from '../../../components/hooks';
import {
  CRISIS_REPORT_PATH,
  REPORT_ID_PATH,
  REPORT_VIEW_PATH,
} from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { labelMapReport } from '../constants';

const { media } = StyleUtils;

const BehaviorAndSafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  overflow-x: auto;
  ${media.tablet`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `}
`;

type Props = {
  behaviorSummary :Map;
  crisisSummary :Map;
  isLoading :boolean;
  reports :List;
  responsePlan :Map;
  contacts :List<Map>;
  contactInfoByContactEKID :Map;
  isContactForByContactEKID :Map;
  stayAwayLocation :Map;
  probation :Map;
  warrant :Map;
};

const HistoryBody = (props :Props) => {
  const {
    behaviorSummary,
    crisisSummary,
    isLoading,
    reports,
    responsePlan,
    contacts,
    contactInfoByContactEKID,
    isContactForByContactEKID,
    stayAwayLocation,
    probation,
    warrant,
  } = props;

  const dispatch = useDispatch();
  const settings = useAppSettings();
  const handleResultClick = useCallback((result :Map) => {
    const reportEKID = getEntityKeyId(result);
    if (settings.get('v1')) {
      dispatch(goToPath(CRISIS_REPORT_PATH.replace(REPORT_ID_PATH, reportEKID)));
    }
    else {
      dispatch(goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID)));
    }
  }, [dispatch, settings]);

  const recent = crisisSummary.get('recent');
  const total = crisisSummary.get('total');


  if (!reports.count() && !isLoading) {
    return <IconSplash icon={faFolderOpen} caption="No reports have been filed." />;
  }

  return (
    <>
      <CrisisCountCard
          count={total}
          isLoading={isLoading} />
      <RecentIncidentCard
          count={recent}
          isLoading={isLoading} />
      <ReportsSummary reports={reports} isLoading={isLoading} />
      {/* <BehaviorAndSafetyGrid>
        <BehaviorCard
            behaviorSummary={behaviorSummary}
            isLoading={isLoading} />
        <OfficerSafetyCard
            isLoading={isLoading}
            reports={reports} />
      </BehaviorAndSafetyGrid> */}
      <BackgroundInformationCard
          backgroundInformation={responsePlan}
          isLoading={isLoading} />
      <ContactCarousel
          contacts={contacts}
          contactInfoByContactEKID={contactInfoByContactEKID}
          isContactForByContactEKID={isContactForByContactEKID} />
      <SearchResults
          hasSearched={false}
          onResultClick={handleResultClick}
          results={reports}
          resultLabels={labelMapReport}
          resultComponent={ProfileResult} />
      <StayAwayCard stayAwayLocation={stayAwayLocation} isLoading={isLoading} />
      <ProbationCard probation={probation} isLoading={isLoading} />
      <WarrantCard warrant={warrant} isLoading={isLoading} />
    </>
  );
};

export default HistoryBody;
