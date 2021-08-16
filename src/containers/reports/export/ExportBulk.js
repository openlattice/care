// @flow
import React from 'react';

import styled from 'styled-components';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Colors,
  IconSplash,
  Spinner,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import ExportIssues from './ExportIssues';

const { isSuccess, isFailure } = ReduxUtils;
const { GREEN, YELLOW } = Colors;

const Wrapper = styled.div`
  max-width: 100%;
  padding-bottom: 30px;
  width: 500px;
`;

const SuccessIcon = (size) => <FontAwesomeIcon icon={faCheckCircle} color={GREEN.G300} size={size} />;

const FailureIcon = (size) => <FontAwesomeIcon icon={faExclamationTriangle} color={YELLOW.Y300} size={size} />;

const CAPTION = 'Generating report. This could take several minutes.';

const ExportBulk = () => {
  const requestState = useSelector((store) => store.getIn(['exportBulk', 'fetchState']));
  const errors = useSelector((store) => store.getIn(['exportBulk', 'errors']));
  const filename = useSelector((store) => store.getIn(['exportBulk', 'filename']));

  let splash = <IconSplash icon={() => <Spinner size="3x" />} caption={CAPTION} />;

  if (isSuccess(requestState)) {
    splash = <IconSplash icon={SuccessIcon} caption={`Success! Check your downloads folder for "${filename}"`} />;
  }
  else if (isFailure(requestState)) {
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

export default ExportBulk;
