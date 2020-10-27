// @flow
import React from 'react';

import {
  Card,
  CardSegment,
  IconSplash,
  SearchResults,
} from 'lattice-ui-kit';
import type { List, Map } from 'immutable';

import ProfileResult from '../ProfileResult';
import { Header } from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';

const NoCrisisReportHistory = () => <IconSplash caption="No Crisis Reports have been filed." />;

type Props = {
  results :List<Map>;
  isLoading :boolean;
};

const ReportHistory = (props :Props) => {
  const {
    isLoading,
    results,
  } = props;

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <Card>
      <CardSegment vertical>
        <Header>Crisis Report History</Header>
        <SearchResults
            hasSearched
            noResults={NoCrisisReportHistory}
            results={results}
            resultComponent={ProfileResult} />
      </CardSegment>
    </Card>
  );
};

export default ReportHistory;
