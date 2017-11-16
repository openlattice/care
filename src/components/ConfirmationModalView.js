/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import { ButtonWrapper } from '../shared/Layout';

import { SUBMISSION_STATES } from '../containers/form/ReportReducer';

function getTitle(submissionState) {
  if (submissionState === SUBMISSION_STATES.SUBMIT_SUCCESS) {
    return 'Success!';
  }
  return 'Error Submitting Report';
}

function getBody(submissionState) {
  if (submissionState === SUBMISSION_STATES.SUBMIT_SUCCESS) {
    return 'Your health report has been submitted.';
  }
  return `There was an error submitting your report. Please try again.
  If there continues to be an issue, contact help@openlattice.com.`;
}

function ConfirmationModal({ submissionState, handleModalButtonClick }) {
  return (
    <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            { getTitle(submissionState) }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { getBody(submissionState) }
        </Modal.Body>
        <Modal.Footer>
          <ButtonWrapper>
            <Button bsStyle="primary" onClick={handleModalButtonClick}>OK</Button>
          </ButtonWrapper>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

ConfirmationModal.propTypes = {
  submissionState: PropTypes.number.isRequired,
  handleModalButtonClick: PropTypes.func.isRequired
};

export default ConfirmationModal;
