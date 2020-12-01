// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Colors,
  IconSplash,
  Spinner,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import ExportIssues from './ExportIssues';
import { exportCrisisXML, resetExportCrisisXML } from './ExportActions';

const { GREEN, YELLOW } = Colors;

const Wrapper = styled.div`
  max-width: 100%;
  padding-bottom: 30px;
  width: 500px;
`;

const SuccessIcon = (size) => <FontAwesomeIcon icon={faCheckCircle} color={GREEN.G300} size={size} />;

const FailureIcon = (size) => <FontAwesomeIcon icon={faExclamationTriangle} color={YELLOW.Y300} size={size} />;

const ExportXML = () => {
  const requestState = useSelector((store) => store.getIn(['export', 'fetchState']));
  const errors = useSelector((store) => store.getIn(['export', 'errors']));
  const filename = useSelector((store) => store.getIn(['export', 'filename']));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(exportCrisisXML());

    return () => dispatch(resetExportCrisisXML());
  }, [dispatch]);

  let splash = <IconSplash icon={() => <Spinner size="3x" />} caption="Generating XML..." />;

  if (requestState === RequestStates.SUCCESS) {
    splash = <IconSplash icon={SuccessIcon} caption={`Success! Check your downloads folder for "${filename}"`} />;
  }
  else if (requestState === RequestStates.FAILURE) {
    splash = (
      <IconSplash
          icon={FailureIcon}
          caption="An unexpected error occurred. Please try again or contact support." />
    );
  }

  return (
    <Wrapper>
      {splash}
      <ExportIssues errors={errors} />
    </Wrapper>
  );
};

export default ExportXML;
