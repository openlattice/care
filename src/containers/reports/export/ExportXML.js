// @flow
import React, { useEffect } from 'react';

import { IconSplash, Spinner } from 'lattice-ui-kit';
import { useRequestState } from 'lattice-utils';
import { useDispatch } from 'react-redux';

import { exportCrisisXML } from './ExportActions';

import { EXPORT_XML } from '../crisis/CrisisActions';

const ExportXML = () => {
  const requestState = useRequestState(['crisisReport', EXPORT_XML]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(exportCrisisXML());
  }, [dispatch]);

  return (
    <IconSplash icon={() => <Spinner size="3x" />} caption="Generating XML..." />
  );
};

export default ExportXML;
