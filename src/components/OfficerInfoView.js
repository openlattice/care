/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Col, FormGroup } from 'react-bootstrap';

import SectionView from './SectionView';
import { PaddedRow, Label, TitleLabel, InlineCheckbox } from '../shared/Layout';


const OfficerInfoView = ({ section, handleTextInput, handleCheckboxChange, input }) => {
  return(
    <div>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>33. Officer Name</TitleLabel>
          <FormControl data-section={section} name='officerName' value={input.officerName} onChange={handleTextInput} />
        </Col>
        <Col lg={6}>
          <TitleLabel>34. Seq ID</TitleLabel>
          <FormControl data-section={section} name='officerSeqID' value={input.officerSeqID} onChange={handleTextInput} />
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>35. Officer Injuries</TitleLabel>
          <FormControl data-section={section} name='officerInjuries' value={input.officerInjuries} onChange={handleTextInput} />
        </Col>
        <Col lg={6}>
          <TitleLabel>36. Officer Certification</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='officerCertification'
                value='crtUnit'
                checked={input.officerCertification.indexOf('crtUnit') !== -1}
                onChange={handleCheckboxChange}>CRT Unit</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='officerCertification'
                value='best'
                checked={input.officerCertification.indexOf('best') !== -1}
                onChange={handleCheckboxChange}>BEST</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='officerCertification'
                value='cit'
                checked={input.officerCertification.indexOf('cit') !== -1}
                onChange={handleCheckboxChange}>CIT</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='officerCertification'
                value='n/a'
                checked={input.officerCertification.indexOf('n/a') !== -1}
                onChange={handleCheckboxChange}>N/A</InlineCheckbox>
          </FormGroup>
        </Col>
      </PaddedRow>
    </div>
  );
}

OfficerInfoView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
}

export default OfficerInfoView;
