/*
 * @flow
 */

import React, { useState } from 'react';

import styled from 'styled-components';
import { Button, Colors } from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import ExportBulkXMLModal from './ExportBulkXMLModal';
import { exportCrisisXMLByDateRange } from './ExportActions';

import DateTimeRange from '../../../components/controls/DateTimeRange';

const { NEUTRAL } = Colors;
const { isPending } = ReduxUtils;

export const DownloadsWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const FormWrapper = styled.div`
  align-items: center;
  border: 1px solid ${NEUTRAL.N100};
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 30px 0;
  width: 100%;
`;

const ButtonRow = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const ExportBulkXMLContainer = () => {
  const dispatch = useDispatch();
  const [dateEnd, setDateEnd] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const fetchState :RequestState = useSelector((state) => state.getIn(['exportBulk', 'fetchState']));

  const handleExport = () => {
    setIsVisible(true);
    dispatch(exportCrisisXMLByDateRange({ dateEnd, dateStart }));
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const pending = isPending(fetchState);

  return (
    <DownloadsWrapper>
      <FormWrapper>
        <DateTimeRange
            label="Crisis Downloads"
            startDate={dateStart}
            endDate={dateEnd}
            onStartChange={(date) => setDateStart(date)}
            onEndChange={(date) => setDateEnd(date)} />
        <ButtonRow>
          <Button
              color="primary"
              disabled={pending || !dateStart || !dateEnd}
              isLoading={pending}
              onClick={handleExport}>
            Export XML
          </Button>
        </ButtonRow>
      </FormWrapper>
      <ExportBulkXMLModal isVisible={isVisible} onClose={handleClose} />
    </DownloadsWrapper>
  );
};

// $FlowFixMe
export default ExportBulkXMLContainer;
