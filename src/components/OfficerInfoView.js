/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Col, FormGroup } from 'react-bootstrap';

import FormNav from './FormNav';
import { PaddedRow, TitleLabel, InlineCheckbox, SectionHeader } from '../shared/Layout';
import { FORM_PATHS } from '../shared/Consts';


const OfficerInfoView = ({ section, handleTextInput, handleCheckboxChange, input, isInReview, handlePageChange }) => {
  return(
    <div>
      { !isInReview() ? <SectionHeader>Officer</SectionHeader> : null }

      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>33. Last Name</TitleLabel>
          <FormControl data-section={section} name='officerLastName' value={input.officerLastName} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
        <Col lg={6}>
          <TitleLabel>First Name</TitleLabel>
          <FormControl data-section={section} name='officerFirstName' value={input.officerFirstName} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>34. Seq ID</TitleLabel>
          <FormControl data-section={section} name='officerSeqID' value={input.officerSeqID} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
        <Col lg={6}>
          <TitleLabel>35. Officer Injuries</TitleLabel>
          <FormControl data-section={section} name='officerInjuries' value={input.officerInjuries} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>36. Officer Certification</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='officerCertification'
                value='crtUnit'
                checked={input.officerCertification.indexOf('crtUnit') !== -1}
                onChange={handleCheckboxChange}
                disabled={isInReview()}>CRT Unit</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='officerCertification'
                value='best'
                checked={input.officerCertification.indexOf('best') !== -1}
                onChange={handleCheckboxChange}
                disabled={isInReview()}>BEST</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='officerCertification'
                value='cit'
                checked={input.officerCertification.indexOf('cit') !== -1}
                onChange={handleCheckboxChange}
                disabled={isInReview()}>CIT</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='officerCertification'
                value='n/a'
                checked={input.officerCertification.indexOf('n/a') !== -1}
                onChange={handleCheckboxChange}
                disabled={isInReview()}>N/A</InlineCheckbox>
          </FormGroup>
        </Col>
      </PaddedRow>

      <FormNav prevPath={FORM_PATHS.DISPOSITION} nextPath={FORM_PATHS.REVIEW} handlePageChange={handlePageChange} />
    </div>
  );
}

OfficerInfoView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
  isInReview: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired
}

export default OfficerInfoView;
