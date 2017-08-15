/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, Label, TitleLabel, CheckboxLabel, OtherWrapper, InlineCheckbox, InlineRadio, InputWrapper } from '../shared/Layout';
import { FLEX } from '../shared/Consts';


const DispositionView = ({ section, handleInput, handleCheckboxChange, handleSingleSelection, input }) => {
  return(
    <SectionView header="Disposition">
      <Row>
        <InputWrapper flex={FLEX.COL_1_3}>
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
          </FormGroup>
          <FormGroup>
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
          </FormGroup>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='disposition'
                value='contactedTreatementProvider'
                checked={input.disposition.indexOf('contactedTreatementProvider') !== -1}
                onChange={handleCheckboxChange}>Contacted or Referred to Current Treatment Provider</InlineCheckbox>
          </FormGroup>
          <FormGroup>
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
        </InputWrapper>

        <InputWrapper flex={FLEX['1_5']}>
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
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_100}>
          <TitleLabel>Hospital Name</TitleLabel>
          <FormControl data-section={section} name='hospital' value={input.hospital} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX.COL_100}>
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
          </FormGroup>
          <OtherWrapper>
            <InlineCheckbox
                data-section={section}
                inline
                name='deescalationTechniques'
                value='other'
                checked={input['deescalationTechniques'].indexOf('other') !== -1}
                onChange={handleCheckboxChange}>Other:</InlineCheckbox>
            <FormControl data-section={section} name='deescalationTechniquesOther' value={input.deescalationTechniquesOther} onChange={handleInput} />
          </OtherWrapper>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX.COL_100}>
          <TitleLabel>30. Called for Specialized Resources</TitleLabel>
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
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX.COL_100}>
          <TitleLabel>31. Narrative of Incident, to include: Results of investigation, basis for actions taken, emotional states, additional witnesses. Property listing.</TitleLabel>
          <FormControl data-section={section} name='incidentNarrative' componentClass='textarea' value={input.incidentNarrative} onChange={handleInput} />
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

DispositionView.propTypes = {
  handleInput: PropTypes.func.isRequired,
  handleSingleSelection: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
}

export default DispositionView;
