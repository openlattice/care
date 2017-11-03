/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import { ButtonWrapper } from '../shared/Layout';

function getTitle(submitSuccess, submitFailure) {
  if (submitSuccess) {
    return 'Success!';
  }
  else if (submitFailure) {
    return 'Error Submitting Report';
  }
}

function getBody(submitSuccess, submitFailure) {
  if (submitSuccess) {
    return 'Your health report has been submitted.';
  }
  else if (submitFailure) {
    return `There was an error submitting your report. Please try again. 
    If there continues to be an issue, contact help@openlattice.com.`;
  }
}

function ConfirmationModal({ submitSuccess, submitFailure, handleModalButtonClick }) {
  return (
    <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            { getTitle(submitSuccess, submitFailure) }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { getBody(submitSuccess, submitFailure) }
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
  submitSuccess: PropTypes.bool.isRequired,
  submitFailure: PropTypes.bool.isRequired,
  handleModalButtonClick: PropTypes.func.isRequired
};

export default ConfirmationModal;
