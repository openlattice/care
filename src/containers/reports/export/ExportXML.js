// @flow
import React, { useEffect } from 'react';

import { IconSplash, Spinner } from 'lattice-ui-kit';
import { useRequestState } from 'lattice-utils';
import { useDispatch } from 'react-redux';

import { EXPORT_CRISIS_XML, exportCrisisXML } from './ExportActions';

const ExportXML = () => {
  const requestState = useRequestState(['crisisReport', EXPORT_CRISIS_XML]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(exportCrisisXML());
  }, [dispatch]);

  return (
    <IconSplash icon={() => <Spinner size="3x" />} caption="Generating XML..." />
  );
};

export default ExportXML;
