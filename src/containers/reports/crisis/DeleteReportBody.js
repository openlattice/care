// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Colors,
  IconSplash,
  Typography,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import { DELETE_CRISIS_REPORT } from './CrisisActions';

import { resetRequestStates } from '../../../core/redux/actions';
import { goToPath } from '../../../core/router/RoutingActions';

const {
  isFailure,
  isSuccess,
} = ReduxUtils;
const { YELLOW } = Colors;

const Wrapper = styled.div`
  max-width: 100%;
  width: 500px;
`;

const FailureIcon = (size) => <FontAwesomeIcon icon={faExclamationTriangle} color={YELLOW.Y300} size={size} />;

type Props = {
  profilePath :string;
  requestState :RequestState;
};

const DeleteReportBody = ({
  profilePath,
  requestState,
} :Props) => {

  const dispatch = useDispatch();
  useEffect(() => () => dispatch(resetRequestStates([DELETE_CRISIS_REPORT])), [dispatch]);
  useEffect(() => {
    if (isSuccess(requestState)) {
      dispatch(goToPath(profilePath));
    }
  }, [dispatch, profilePath, requestState]);

  let splash = <Typography>Are you sure you want to delete this report? This action cannot be undone.</Typography>;

  if (isFailure(requestState)) {
    splash = (
      <IconSplash
          icon={FailureIcon}
          caption="An unexpected error occurred. Please try again or contact support." />
    );
  }

  return (
    <Wrapper>
      {splash}
    </Wrapper>
  );
};

export default DeleteReportBody;
