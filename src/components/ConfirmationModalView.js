/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import { ButtonWrapper } from '../shared/Layout';

function getTitle(submissionSuccess) {
  if (submissionSuccess) {
    return 'Success!';
  }
  return 'Error Submitting Report';
}

function getBody(submissionSuccess) {
  if (submissionSuccess) {
    return 'Your health report has been submitted.';
  }
  return `There was an error submitting your report. Please try again.
  If there continues to be an issue, contact help@openlattice.com.`;
}

function ConfirmationModal({ submissionSuccess, handleModalButtonClick }) {
  return (
    <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            { getTitle(submissionSuccess) }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { getBody(submissionSuccess) }
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
  submissionSuccess: PropTypes.bool.isRequired,
  handleModalButtonClick: PropTypes.func.isRequired
};

export default ConfirmationModal;
