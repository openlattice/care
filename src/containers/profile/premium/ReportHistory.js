// @flow
import React from 'react';

import {
  Card,
  CardSegment,
  SearchResults
} from 'lattice-ui-kit';
import type { List, Map } from 'immutable';

import ProfileResult from '../ProfileResult';
import { Header } from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';

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
        <Header>Report History</Header>
        <SearchResults
            hasSearched={false}
            results={results}
            resultComponent={ProfileResult} />
      </CardSegment>
    </Card>
  );
};

export default ReportHistory;
