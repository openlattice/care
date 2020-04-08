// @flow
import React from 'react';
import { List } from 'immutable';
import { CardSkeleton } from '../../../components/skeletons';

type Props = {
  isLoading :boolean;
  symptoms :List;
};

const SymptomsCard = ({ isLoading, symptoms } :Props) => {
  if (isLoading) return <CardSkeleton />;

  return <div />;
};

export default SymptomsCard;
