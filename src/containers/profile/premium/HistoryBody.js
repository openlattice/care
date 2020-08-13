// @flow
import React, { useEffect } from 'react';

import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { List, Map } from 'immutable';
import { IconSplash } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';

import ReportHistory from './ReportHistory';
import ReportsSummary from './ReportsSummary';

import CrisisCountCard from '../CrisisCountCard';
import ProbationCard from '../../../components/premium/probation/ProbationCard';
import RecentIncidentCard from '../RecentIncidentCard';
import StayAwayCard from '../../../components/premium/stayaway/StayAwayCard';
import WarrantCard from '../../../components/premium/warrant/WarrantCard';
import { useAppSettings } from '../../../components/hooks';
import { PROFILE_ID_PARAM } from '../../../core/router/Routes';
import { getIncidentReportsSummary } from '../actions/ReportActions';

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
      <ReportHistory isLoading={isLoading} results={reports} />
      <StayAwayCard stayAwayLocation={stayAwayLocation} isLoading={isLoading} />
      <ProbationCard probation={probation} isLoading={isLoading} />
      <WarrantCard warrant={warrant} isLoading={isLoading} />
    </>
  );
};

export default HistoryBody;
