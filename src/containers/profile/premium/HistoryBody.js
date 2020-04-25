// @flow
import React, { useCallback } from 'react';

import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { List, Map } from 'immutable';
import {
  Card,
  CardSegment,
  IconSplash,
  SearchResults
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

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
  REPORT_ID_PATH,
  REPORT_VIEW_PATH,
} from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { labelMapReport } from '../constants';

type Props = {
  crisisSummary :Map;
  isLoading :boolean;
  reports :List;
  stayAwayLocation :Map;
  probation :Map;
  warrant :Map;
};

const HistoryBody = (props :Props) => {
  const {
    crisisSummary,
    isLoading,
    reports,
    stayAwayLocation,
    probation,
    warrant,
  } = props;

  const dispatch = useDispatch();
  const settings = useAppSettings();
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
