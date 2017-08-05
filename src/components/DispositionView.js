/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, TextInput, Label, TitleLabel, CheckboxLabel, CheckboxWrapper, OtherWrapper, InlineCheckbox, InlineRadio, InputWrapper } from '../shared/Layout';
import { FLEX } from '../shared/Consts';


const DispositionView = ({ section, handleInput, handleCheckboxChange, handleSingleSelection, input }) => {
  return(
    <SectionView header="Disposition">
      <Row>
        <InputWrapper flex={FLEX['1_3']}>
          <TitleLabel>28. Disposition</TitleLabel>
          <CheckboxWrapper>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='28a'
                  value='arrest'
                  checked={input['28a'].indexOf('arrest') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Arrest</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='28a'
                  value='ep'
                  checked={input['28a'].indexOf('ep') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>EP</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='28a'
                  value='voluntaryER'
                  checked={input['28a'].indexOf('voluntaryER') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Voluntary ER Intake</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='28a'
                  value='bcri'
                  checked={input['28a'].indexOf('bcri') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>BCRI</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='28a'
                  value='infoAndReferral'
                  checked={input['28a'].indexOf('infoAndReferral') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Information and Referral</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='28a'
                  value='lead'
                  checked={input['28a'].indexOf('lead') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>LEAD</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='28a'
                  value='contactedTreatementProvider'
                  checked={input['28a'].indexOf('contactedTreatementProvider') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Contacted or Referred to Current Treatment Provider</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='28a'
                  value='criminalCitation'
                  checked={input['28a'].indexOf('criminalCitation') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Criminal Citation</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='28a'
                  value='civilCitation'
                  checked={input['28a'].indexOf('civilCitation') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Civil Citation</CheckboxLabel>
            </span>
          </CheckboxWrapper>
        </InputWrapper>
        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>Transported to Hospital</TitleLabel>
          <InlineRadio
              data-section={section}
              name='28b'
              value='yes'
              checked={input['28b'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <InlineRadio
              data-section={section}
              name='28b'  
              value='no'
              checked={input['28b'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </InputWrapper>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>Hospital Name</TitleLabel>
          <TextInput data-section={section} name='28c' value={input['28c']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>29. De-escalation Techniques/Equipment Used</TitleLabel>
          <CheckboxWrapper>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='29a'
                  value='verbalization'
                  checked={input['29a'].indexOf('verbalization') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Verbalization</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='29a'
                  value='handcuffs'
                  checked={input['29a'].indexOf('handcuffs') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Handcuffs</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='29a'
                  value='legRestraints'
                  checked={input['29a'].indexOf('legRestraints') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Leg Restraints</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='29a'
                  value='taser'
                  checked={input['29a'].indexOf('taser') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Taser</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='29a'
                  value='arrestControl'
                  checked={input['29a'].indexOf('arrestControl') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Arrest Control (Hands / Feet)</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name='29a'
                  value='n/a'
                  checked={input['29a'].indexOf('n/a') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>N/A</CheckboxLabel>
            </span>
          </CheckboxWrapper>
          <OtherWrapper>
            <InlineCheckbox
                data-section={section}
                name='29a'
                value='other'
                checked={input['29a'].indexOf('other') !== -1}
                onChange={handleCheckboxChange} />
            <CheckboxLabel>Other:</CheckboxLabel>
            <TextInput data-section={section} name='29b' value={input['29b']} onChange={handleInput} />
          </OtherWrapper>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>30. Called for Specialized Resources</TitleLabel>
          <CheckboxWrapper>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name={30}
                  value='bcri'
                  checked={input[30].indexOf('bcri') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>BCRI / Mobile Crisis Response Team</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name={30}
                  value='citOfficer'
                  checked={input[30].indexOf('citOfficer') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>CIT Officer</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name={30}
                  value='crtUnit'
                  checked={input[30].indexOf('crtUnit') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>CRT Unit</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name={30}
                  value='esu'
                  checked={input[30].indexOf('esu') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>ESU</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name={30}
                  value='swat'
                  checked={input[30].indexOf('swat') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>SWAT</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name={30}
                  value='negotiationTeam'
                  checked={input[30].indexOf('negotiationTeam') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Negotiation Team</CheckboxLabel>
            </span>
            <span>
              <InlineCheckbox
                  data-section={section}
                  name={30}
                  value='homelessOutreach'
                  checked={input[30].indexOf('homelessOutreach') !== -1}
                  onChange={handleCheckboxChange} />
              <CheckboxLabel>Homeless Outreach</CheckboxLabel>
            </span>
          </CheckboxWrapper>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>31. Narrative of Incident, to include: Results of investigation, basis for actions taken, emotional states, additional witnesses. Property listing.</TitleLabel>
          <TextInput data-section={section} name={31} componentClass='textarea' onChange={handleInput} />
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

export default DispositionView;
