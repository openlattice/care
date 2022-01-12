/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import {
  Button,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import { Header } from '../../components/layout';
import { getAllResponsePlansExport } from '../profile/edit/responseplan/ResponsePlanActions';

const { isPending } = ReduxUtils;
const ButtonRow = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const ResponsePlanDownloadsContainer = () => {
  const dispatch = useDispatch();
  const downloadState :RequestState = useSelector((state) => state.getIn(['profile', 'responsePlan', 'downloadState']));

  const handleExport = () => {
    dispatch(getAllResponsePlansExport());
  };

  const pending = isPending(downloadState);

  return (
    <>
      <Header>
        Response Plan Downloads
      </Header>
      <ButtonRow>
        <Button
            color="primary"
            isLoading={pending}
            onClick={handleExport}
            type="button">
          Download Response Plans
        </Button>
      </ButtonRow>
    </>
  );
};

// $FlowFixMe
export default ResponsePlanDownloadsContainer;
