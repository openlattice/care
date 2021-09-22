// @flow
import React from 'react';

import { Modal, ModalFooter } from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import DeleteReportBody from './DeleteReportBody';
import { DELETE_CRISIS_REPORT } from './CrisisActions';

import { CRISIS_REPORT, REQUEST_STATE } from '../../../core/redux/constants';

const { isPending } = ReduxUtils;

type Props = {
  isVisible :boolean;
  onClickPrimary :() => void;
  onClose :() => void;
  profilePath :string;
};

const DeleteReportModal = ({
  isVisible,
  onClickPrimary,
  onClose,
  profilePath,
} :Props) => {
  const requestState = useSelector((store) => store.getIn([CRISIS_REPORT, DELETE_CRISIS_REPORT, REQUEST_STATE]));
  const loading = isPending(requestState);
  const handleClose = () => {
    if (!isPending(requestState)) {
      onClose();
    }
  };

  const footer = (
    <ModalFooter
        isDisabledSecondary={loading}
        isPendingPrimary={loading}
        onClickPrimary={onClickPrimary}
        onClickSecondary={handleClose}
        shouldStretchButtons
        textPrimary="Delete"
        textSecondary="Cancel" />
  );

  return (
    <Modal
        isVisible={isVisible}
        onClose={handleClose}
        textTitle="Delete Report"
        viewportScrolling
        withFooter={footer}>
      <DeleteReportBody
          profilePath={profilePath}
          onClickPrimary={onClickPrimary}
          onClickSecondary={handleClose}
          requestState={requestState} />
    </Modal>
  );
};

export default DeleteReportModal;
