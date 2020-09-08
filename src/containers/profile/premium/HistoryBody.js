// @flow
import React from 'react';

import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { List, Map } from 'immutable';
import { IconSplash } from 'lattice-ui-kit';

import ReportHistory from './ReportHistory';
import ReportsSummary from './ReportsSummary';

import CrisisCountCard from '../CrisisCountCard';
import ProbationCard from '../../../components/premium/probation/ProbationCard';
import RecentIncidentCard from '../RecentIncidentCard';
import StayAwayCard from '../../../components/premium/stayaway/StayAwayCard';
import WarrantCard from '../../../components/premium/warrant/WarrantCard';

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
