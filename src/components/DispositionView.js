/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';

import SectionView from './SectionView';
import { PaddedRow, Label, TitleLabel, CheckboxLabel, OtherWrapper, InlineCheckbox, InlineRadio, InputWrapper } from '../shared/Layout';
import { FLEX } from '../shared/Consts';


const DispositionView = ({ section, handleTextInput, handleCheckboxChange, handleSingleSelection, input }) => {
  return(
    <SectionView header="Disposition">
      <PaddedRow>
        <Col lg={5}>
          <TitleLabel>28. Disposition</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='arrest'
                checked={input.disposition.indexOf('arrest') !== -1}
                onChange={handleCheckboxChange}>Arrest</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='ep'
                checked={input.disposition.indexOf('ep') !== -1}
                onChange={handleCheckboxChange}>EP</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='voluntaryER'
                checked={input.disposition.indexOf('voluntaryER') !== -1}
                onChange={handleCheckboxChange}>Voluntary ER Intake</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='bcri'
                checked={input.disposition.indexOf('bcri') !== -1}
                onChange={handleCheckboxChange}>BCRI</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='infoAndReferral'
                checked={input.disposition.indexOf('infoAndReferral') !== -1}
                onChange={handleCheckboxChange}>Information and Referral</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='lead'
                checked={input.disposition.indexOf('lead') !== -1}
                onChange={handleCheckboxChange}>LEAD</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='contactedTreatementProvider'
                checked={input.disposition.indexOf('contactedTreatementProvider') !== -1}
                onChange={handleCheckboxChange}>Contacted or Referred to Current Treatment Provider</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='criminalCitation'
                checked={input.disposition.indexOf('criminalCitation') !== -1}
                onChange={handleCheckboxChange}>Criminal Citation</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='civilCitation'
                checked={input.disposition.indexOf('civilCitation') !== -1}
                onChange={handleCheckboxChange}>Civil Citation</InlineCheckbox>
          </FormGroup>
        </Col>

        <Col lg={2}>
          <TitleLabel>Transported to Hospital</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='hospitalTransport'
              value={true}
              checked={input.hospitalTransport === 'true'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name='hospitalTransport'  
              value={false}
              checked={input.hospitalTransport === 'false'}
              onChange={handleSingleSelection}>No</InlineRadio>
        </Col>
        <Col lg={5}>
          <TitleLabel>Hospital Name</TitleLabel>
          <FormControl data-section={section} name='hospital' value={input.hospital} onChange={handleTextInput} />
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>29. De-escalation Techniques/Equipment Used</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                data-section={section}
                inline
                name='deescalationTechniques'
                value='verbalization'
                checked={input.deescalationTechniques.indexOf('verbalization') !== -1}
                onChange={handleCheckboxChange}>Verbalization</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='deescalationTechniques'
                value='handcuffs'
                checked={input.deescalationTechniques.indexOf('handcuffs') !== -1}
                onChange={handleCheckboxChange}>Handcuffs</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='deescalationTechniques'
                value='legRestraints'
                checked={input.deescalationTechniques.indexOf('legRestraints') !== -1}
                onChange={handleCheckboxChange}>Leg Restraints</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='deescalationTechniques'
                value='taser'
                checked={input.deescalationTechniques.indexOf('taser') !== -1}
                onChange={handleCheckboxChange}>Taser</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='deescalationTechniques'
                value='arrestControl'
                checked={input.deescalationTechniques.indexOf('arrestControl') !== -1}
                onChange={handleCheckboxChange}>Arrest Control (Hands / Feet)</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='deescalationTechniques'
                value='n/a'
                checked={input.deescalationTechniques.indexOf('n/a') !== -1}
                onChange={handleCheckboxChange}>N/A</InlineCheckbox>
            <OtherWrapper>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name='deescalationTechniques'
                  value='other'
                  checked={input['deescalationTechniques'].indexOf('other') !== -1}
                  onChange={handleCheckboxChange}>Other:</InlineCheckbox>
              <FormControl data-section={section} name='deescalationTechniquesOther' value={input.deescalationTechniquesOther} onChange={handleTextInput} />
            </OtherWrapper>
          </FormGroup>
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>30. Called for Specialized Resources</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                data-section={section}
                inline
                name='specializedResourcesCalled'
                value='bcri'
                checked={input.specializedResourcesCalled.indexOf('bcri') !== -1}
                onChange={handleCheckboxChange}>BCRI / Mobile Crisis Response Team</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='specializedResourcesCalled'
                value='citOfficer'
                checked={input.specializedResourcesCalled.indexOf('citOfficer') !== -1}
                onChange={handleCheckboxChange}>CIT Officer</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='specializedResourcesCalled'
                value='crtUnit'
                checked={input.specializedResourcesCalled.indexOf('crtUnit') !== -1}
                onChange={handleCheckboxChange}>CRT Unit</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='specializedResourcesCalled'
                value='esu'
                checked={input.specializedResourcesCalled.indexOf('esu') !== -1}
                onChange={handleCheckboxChange}>ESU</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='specializedResourcesCalled'
                value='swat'
                checked={input.specializedResourcesCalled.indexOf('swat') !== -1}
                onChange={handleCheckboxChange}>SWAT</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='specializedResourcesCalled'
                value='negotiationTeam'
                checked={input.specializedResourcesCalled.indexOf('negotiationTeam') !== -1}
                onChange={handleCheckboxChange}>Negotiation Team</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='specializedResourcesCalled'
                value='homelessOutreach'
                checked={input.specializedResourcesCalled.indexOf('homelessOutreach') !== -1}
                onChange={handleCheckboxChange}>Homeless Outreach</InlineCheckbox>
          </FormGroup>
        </Col>
      </PaddedRow>

      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>31. Narrative of Incident, to include: Results of investigation, basis for actions taken, emotional states, additional witnesses. Property listing.</TitleLabel>
          <FormControl data-section={section} name='incidentNarrative' componentClass='textarea' value={input.incidentNarrative} onChange={handleTextInput} />
        </Col>
      </PaddedRow>
    </SectionView>
  );
}

DispositionView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
}

export default DispositionView;
