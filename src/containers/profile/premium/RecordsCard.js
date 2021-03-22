// @flow

import React from 'react';
import type { ComponentType } from 'react';

import { List } from 'immutable';
import {
  Card,
  CardSegment,
  IconSplash,
  SearchResults,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import { Header } from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';
import type { SearchResultProps } from '../../../types';

type Props = {
  storePath :string[];
  resultComponent :ComponentType<SearchResultProps>;
  title :string;
};

const RecordsCard = ({ storePath, resultComponent, title } :Props) => {
  const searchResults = useSelector((store) => store.getIn([...storePath, 'hits'], List()));
  const fetchState = useSelector((store) => store.getIn([...storePath, 'fetchState']));
  const isLoading = ReduxUtils.isPending(fetchState);

  if (isLoading) {
    return <CardSkeleton />;
  }

  const NoRecord = () => <IconSplash caption={`No ${title} have been filed.`} />;

  return (
    <Card>
      <CardSegment vertical>
        <Header>{title}</Header>
        <SearchResults
            hasSearched
            noResults={NoRecord}
            results={searchResults}
            resultComponent={resultComponent} />
      </CardSegment>
    </Card>
  );
};

export default RecordsCard;
