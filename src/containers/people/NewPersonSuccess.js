// @flow
import React, { useEffect } from 'react';

import { Map } from 'immutable';
import { CardStack } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import { clearSearchResults } from './PeopleActions';

import SuccessSplash from '../reports/shared/SuccessSplash';

type Props = {
  createdPerson :Map;
}

const NewPersonSuccess = ({ createdPerson } :Props) => {
  const dispatch = useDispatch();

  useEffect(() => () => dispatch(clearSearchResults()), [dispatch]);
  return (
    <CardStack>
      <SuccessSplash reportType="new person" selectedPerson={createdPerson} />
    </CardStack>
  );
};

export default NewPersonSuccess;
