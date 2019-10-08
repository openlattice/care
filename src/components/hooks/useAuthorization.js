// @flow

import { List } from 'immutable';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RequestStates } from 'redux-reqseq';

const useAuthorization = (feature :string, callback :any) => {
  const [isAuthorized, setAuthorization] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    callback();
  }, [callback]);

  const allowedPrincipals :List<string> = useSelector(state => state
    .getIn(['app', 'selectedOrganizationSettings', 'private', feature]));

  const currentPrincipalIds :List<string> = useSelector(state => state
    .getIn(['authorization', 'currentPrincipalIds'])) || List();

  const fetchState = useSelector(state => state.getIn(['authorization', 'fetchState']));

  useEffect(() => {
    const loadState = fetchState === RequestStates.PENDING;

    if (!List.isList(allowedPrincipals)) {
      setAuthorization(true);
      setLoading(loadState);
    }
    else {
      const hasPrincipal = allowedPrincipals
        .some(principalId => currentPrincipalIds.indexOf(principalId) !== -1);
      setAuthorization(hasPrincipal);
      setLoading(loadState);
    }
  }, [allowedPrincipals, currentPrincipalIds, fetchState]);

  return [isAuthorized, isLoading];
};

export default useAuthorization;
