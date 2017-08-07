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
        <InputWrapper flex={FLEX['1_3']}>
          <TitleLabel>28. Disposition</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='28a'
                value='arrest'
                checked={input['28a'].indexOf('arrest') !== -1}
                onChange={handleCheckboxChange}>Arrest</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='28a'
                value='ep'
                checked={input['28a'].indexOf('ep') !== -1}
                onChange={handleCheckboxChange}>EP</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='28a'
                value='voluntaryER'
                checked={input['28a'].indexOf('voluntaryER') !== -1}
                onChange={handleCheckboxChange}>Voluntary ER Intake</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='28a'
                value='bcri'
                checked={input['28a'].indexOf('bcri') !== -1}
                onChange={handleCheckboxChange}>BCRI</InlineCheckbox>
          </FormGroup>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='28a'
                value='infoAndReferral'
                checked={input['28a'].indexOf('infoAndReferral') !== -1}
                onChange={handleCheckboxChange}>Information and Referral</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='28a'
                value='lead'
                checked={input['28a'].indexOf('lead') !== -1}
                onChange={handleCheckboxChange}>LEAD</InlineCheckbox>
          </FormGroup>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='28a'
                value='contactedTreatementProvider'
                checked={input['28a'].indexOf('contactedTreatementProvider') !== -1}
                onChange={handleCheckboxChange}>Contacted or Referred to Current Treatment Provider</InlineCheckbox>
          </FormGroup>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='28a'
                value='criminalCitation'
                checked={input['28a'].indexOf('criminalCitation') !== -1}
                onChange={handleCheckboxChange}>Criminal Citation</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='28a'
                value='civilCitation'
                checked={input['28a'].indexOf('civilCitation') !== -1}
                onChange={handleCheckboxChange}>Civil Citation</InlineCheckbox>
          </FormGroup>
        </InputWrapper>

        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>Transported to Hospital</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='28b'
              value='yes'
              checked={input['28b'] === 'yes'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name='28b'  
              value='no'
              checked={input['28b'] === 'no'}
              onChange={handleSingleSelection}>No</InlineRadio>
        </InputWrapper>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>Hospital Name</TitleLabel>
          <FormControl data-section={section} name='28c' value={input['28c']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>29. De-escalation Techniques/Equipment Used</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                data-section={section}
                inline
                name='29a'
                value='verbalization'
                checked={input['29a'].indexOf('verbalization') !== -1}
                onChange={handleCheckboxChange}>Verbalization</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='29a'
                value='handcuffs'
                checked={input['29a'].indexOf('handcuffs') !== -1}
                onChange={handleCheckboxChange}>Handcuffs</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='29a'
                value='legRestraints'
                checked={input['29a'].indexOf('legRestraints') !== -1}
                onChange={handleCheckboxChange}>Leg Restraints</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='29a'
                value='taser'
                checked={input['29a'].indexOf('taser') !== -1}
                onChange={handleCheckboxChange}>Taser</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='29a'
                value='arrestControl'
                checked={input['29a'].indexOf('arrestControl') !== -1}
                onChange={handleCheckboxChange}>Arrest Control (Hands / Feet)</InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name='29a'
                value='n/a'
                checked={input['29a'].indexOf('n/a') !== -1}
                onChange={handleCheckboxChange}>N/A</InlineCheckbox>
          </FormGroup>
          <OtherWrapper>
            <InlineCheckbox
                data-section={section}
                inline
                name='29a'
                value='other'
                checked={input['29a'].indexOf('other') !== -1}
                onChange={handleCheckboxChange}>Other:</InlineCheckbox>
            <FormControl data-section={section} name='29b' value={input['29b']} onChange={handleInput} />
          </OtherWrapper>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>30. Called for Specialized Resources</TitleLabel>
          <InlineCheckbox
              data-section={section}
              inline
              name={30}
              value='bcri'
              checked={input[30].indexOf('bcri') !== -1}
              onChange={handleCheckboxChange}>BCRI / Mobile Crisis Response Team</InlineCheckbox>
          <InlineCheckbox
              data-section={section}
              inline
              name={30}
              value='citOfficer'
              checked={input[30].indexOf('citOfficer') !== -1}
              onChange={handleCheckboxChange}>CIT Officer</InlineCheckbox>
          <InlineCheckbox
              data-section={section}
              inline
              name={30}
              value='crtUnit'
              checked={input[30].indexOf('crtUnit') !== -1}
              onChange={handleCheckboxChange}>CRT Unit</InlineCheckbox>
          <InlineCheckbox
              data-section={section}
              inline
              name={30}
              value='esu'
              checked={input[30].indexOf('esu') !== -1}
              onChange={handleCheckboxChange}>ESU</InlineCheckbox>
          <InlineCheckbox
              data-section={section}
              inline
              name={30}
              value='swat'
              checked={input[30].indexOf('swat') !== -1}
              onChange={handleCheckboxChange}>SWAT</InlineCheckbox>
          <InlineCheckbox
              data-section={section}
              inline
              name={30}
              value='negotiationTeam'
              checked={input[30].indexOf('negotiationTeam') !== -1}
              onChange={handleCheckboxChange}>Negotiation Team</InlineCheckbox>
          <InlineCheckbox
              data-section={section}
              inline
              name={30}
              value='homelessOutreach'
              checked={input[30].indexOf('homelessOutreach') !== -1}
              onChange={handleCheckboxChange}>Homeless Outreach</InlineCheckbox>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>31. Narrative of Incident, to include: Results of investigation, basis for actions taken, emotional states, additional witnesses. Property listing.</TitleLabel>
          <FormControl data-section={section} name={31} componentClass='textarea' onChange={handleInput} />
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

export default DispositionView;
