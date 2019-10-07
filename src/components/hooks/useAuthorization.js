// @flow

import { List } from 'immutable';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const useAuthorization = (feature :string, callback :any) => {
  const [isAuthorized, setAuthorization] = useState(false);

  useEffect(() => {
    callback();
  }, [callback]);

  const allowedPrincipals :List<string> = useSelector(state => state
    .getIn(['app', 'selectedOrganizationSettings', 'private', feature]));

  const currentPrincipalIds :List<string> = useSelector(state => state
    .getIn(['authorization', 'currentPrincipalIds'])) || List();

  useEffect(() => {
    if (!List.isList(allowedPrincipals)) {
      setAuthorization(true);
    }
    else {
      const hasPrincipal = allowedPrincipals
        .some(principalId => currentPrincipalIds.indexOf(principalId) !== -1);
      setAuthorization(hasPrincipal);
    }
  }, [allowedPrincipals, currentPrincipalIds]);

  return isAuthorized;
};

export default useAuthorization;
