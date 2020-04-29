// @flow
import React, { useCallback, useEffect } from 'react';

import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { List, Map } from 'immutable';
import {
  Card,
  CardSegment,
  IconSplash,
  SearchResults
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';

import ReportsSummary from './ReportsSummary';

import CrisisCountCard from '../CrisisCountCard';
import ProbationCard from '../../../components/premium/probation/ProbationCard';
import ProfileResult from '../ProfileResult';
import RecentIncidentCard from '../RecentIncidentCard';
import StayAwayCard from '../../../components/premium/stayaway/StayAwayCard';
import WarrantCard from '../../../components/premium/warrant/WarrantCard';
import { useAppSettings } from '../../../components/hooks';
import { Header } from '../../../components/layout';
import {
  CRISIS_REPORT_PATH,
  PROFILE_ID_PARAM,
  REPORT_ID_PATH,
  REPORT_VIEW_PATH,
} from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { getIncidentReportsSummary } from '../actions/ReportActions';
import { labelMapReport } from '../constants';

type Props = {
  behaviorSummary :List<Map>;
  crisisSummary :Map;
  isLoading :boolean;
  probation :Map;
  reports :List;
  safetySummary :List<Map>;
  stayAwayLocation :Map;
  warrant :Map;
};

const HistoryBody = (props :Props) => {
  const {
    behaviorSummary,
    crisisSummary,
    isLoading,
    probation,
    reports,
    safetySummary,
    stayAwayLocation,
    warrant,
  } = props;

  const dispatch = useDispatch();
  const settings = useAppSettings();

  const match = useRouteMatch();
  const { [PROFILE_ID_PARAM]: profileId } = match.params;

  useEffect(() => {
    if (settings.get('v2')) {
      dispatch(getIncidentReportsSummary(profileId));
    }
  }, [profileId, settings, dispatch]);

  const handleResultClick = useCallback((result :Map) => {
    const reportEKID = getEntityKeyId(result);
    if (settings.get('v1') || settings.get('v2')) {
      dispatch(goToPath(CRISIS_REPORT_PATH.replace(REPORT_ID_PATH, reportEKID)));
    }
    else {
      dispatch(goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID)));
    }
  }, [dispatch, settings]);

  const recent = crisisSummary.get('recent');
  const total = crisisSummary.get('total');

  if (!total && !isLoading) {
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
      <ReportsSummary
          safetySummary={safetySummary}
          behaviorSummary={behaviorSummary}
          isLoading={isLoading} />
      <Card>
        <CardSegment vertical>
          <Header>Report History</Header>
          <SearchResults
              hasSearched={false}
              onResultClick={handleResultClick}
              results={reports}
              resultLabels={labelMapReport}
              resultComponent={ProfileResult} />
        </CardSegment>
      </Card>
      <StayAwayCard stayAwayLocation={stayAwayLocation} isLoading={isLoading} />
      <ProbationCard probation={probation} isLoading={isLoading} />
      <WarrantCard warrant={warrant} isLoading={isLoading} />
    </>
  );
};

export default HistoryBody;
