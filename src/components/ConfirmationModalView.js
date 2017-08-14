/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import { ButtonWrapper } from '../shared/Layout';

function ConfirmationModal({ handleModalButtonClick }) {
  return (
    <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            Success!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your health report has been submitted.
        </Modal.Body>
        <Modal.Footer>
          <ButtonWrapper>
            <Button bsStyle='primary' onClick={handleModalButtonClick}>OK</Button>
          </ButtonWrapper>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

ConfirmationModal.propTypes = {
  handleModalButtonClick: PropTypes.func.isRequired
}

export default ConfirmationModal;
