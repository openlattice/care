// @flow

import { useEffect, useState } from 'react';

import { List, Set } from 'immutable';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import useAppSettings from './useAppSettings';

import { adminOnly } from '../../containers/settings/constants';
import { selectAdminRolePrincipleId, selectCurrentOrganizationId } from '../../core/redux/selectors';
import type { PrivateSetting } from '../../containers/settings/constants';

const useAuthorization = (feature :PrivateSetting, callback :any) => {
  const [isAuthorized, setAuthorization] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [settings] = useAppSettings();

  useEffect(() => {
    if (callback instanceof Function) {
      callback();
    }
  }, [callback]);

  const currentPrincipalIds :Set<string> = useSelector((state) => state
    .getIn(['authorization', 'currentPrincipalIds'])) || Set();

  const organizationId = useSelector(selectCurrentOrganizationId());
  const adminPrincipleId = useSelector(selectAdminRolePrincipleId(organizationId));

  const fetchState = useSelector((state) => state.getIn(['authorization', 'fetchState']));

  let allowedPrincipals :List<string> = settings
    .getIn(['private', feature.name]);

  if (feature === adminOnly) {
    allowedPrincipals = List([adminPrincipleId]);
  }

  useEffect(() => {
    const loadState = fetchState === RequestStates.PENDING;

    if (!List.isList(allowedPrincipals)) {
      setAuthorization(true);
      setLoading(loadState);
    }
    else {
      const hasPrincipal = !!currentPrincipalIds.intersect(allowedPrincipals).count();
      setAuthorization(hasPrincipal);
      setLoading(loadState);
    }
  }, [allowedPrincipals, currentPrincipalIds, fetchState]);

  return [isAuthorized, isLoading];
};

export default useAuthorization;
