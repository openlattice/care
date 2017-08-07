/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

import SectionView from './SectionView';
import { Row, TextInput, SelectInput, InputWrapper, Label, InlineCheckbox, InlineRadio, TitleLabel, CheckboxLabel, CheckboxWrapper, OtherWrapper } from '../shared/Layout';
import { FLEX } from '../shared/Consts'
import { FormGroup, InputGroup } from 'react-bootstrap';

const ConsumerInfoView = ({ section, handleInput, handleSingleSelection, handleCheckboxChange, input }) => {

  return (
    <SectionView header='Consumer Information'>
      <Row>
        <InputWrapper>
          <TitleLabel>13. Consumer Name (Last, First, MI)</TitleLabel>
          <TextInput data-section={section} name='13a' value={input['13a']} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>Residence / Address (Apt Number, City, County, State, Zip)</TitleLabel>
          <TextInput data-section={section} name='13b' value={input['13b']} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>Consumer Phone Number</TitleLabel>
          <TextInput data-section={section} name='13c' value={input['13c']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>14. Military Status</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name='14a'
                value='active'
                checked={input['14a'] === 'active'}
                onChange={handleSingleSelection}>Active</InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name ='14a' 
                value='veteran'
                checked={input['14a'] === 'veteran'}
                onChange={handleSingleSelection}>Veteran</InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name ='14a'
                value='n/a'
                checked={input['14a'] === 'n/a'}
                onChange={handleSingleSelection}>N/A</InlineRadio>
          </InputWrapper>

          <InputWrapper flex={FLEX['1_5']}>
            <TitleLabel>Gender</TitleLabel>
            <SelectInput
                componentClass='select'
                placeholder='select'
                data-section={section}
                name='14b'
                value={input['14b']}
                onChange={handleSingleSelection}>
              <option value=''>Select</option>
              <option value='female'>Female</option>
              <option value='male'>Male</option>
              <option value='nonbinary'>Non-binary</option>
            </SelectInput>
          </InputWrapper>

          <InputWrapper flex={FLEX['1_5']}>
            <TitleLabel>Race</TitleLabel>
            <SelectInput
                componentClass='select'
                placeholder='select'
                data-section={section}
                name='14c'
                value={input['14c']}
                onChange={handleSingleSelection}>
              <option value=''>Select</option>
              <option value='americanIndian'>American Indian or Alaska Native</option>
              <option value='asian'>Asian</option>
              <option value='black'>Black or African American</option>
              <option value='hispanic'>Hispanic or Latino</option>
              <option value='nativeHawaiian'>Native Hawaiian or Other Pacific Islander</option>
              <option value='white'>White</option>
              <option value='other'>Other</option>
            </SelectInput>
          </InputWrapper>

        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>Age</TitleLabel>
          <TextInput data-section={section} name='14d' value={input['14d']} onChange={handleInput} />
        </InputWrapper>

        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>DOB</TitleLabel>
          <TextInput data-section={section} name='14e' value={input['14e']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>15. Homeless</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='15a'
              value='yes'
              checked={input['15a'] === 'yes'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name ='15a' 
              value='no'
              checked={input['15a'] === 'no'}
              onChange={handleSingleSelection}>No</InlineRadio>
        </InputWrapper>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>If Yes, Where Do They Usually Sleep / Frequent?</TitleLabel>
          <TextInput data-section={section} name='15b' value={input['15b']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>16. Consumer Using Drugs, Alcohol</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='16a'
              value='drugs'
              checked={input['16a'] === 'drugs'}
              onChange={handleSingleSelection}>Drugs</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name ='16a' 
              value='alcohol'
              checked={input['16a'] === 'alcohol'}
              onChange={handleSingleSelection}>Alcohol</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name ='16a' 
              value='both'
              checked={input['16a'] === 'both'}
              onChange={handleSingleSelection}>Both</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name ='16a' 
              value='n/a'
              checked={input['16a'] === 'n/a'}
              onChange={handleSingleSelection}>N/A</InlineRadio>
        </InputWrapper>

        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>Drug type</TitleLabel>
          <TextInput data-section={section} name='16b' value={input['16b']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>17. Prescribed Medication</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='17a'
              value='yes'
              checked={input['17a'] === 'yes'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name='17a'
              value='no'
              checked={input['17a'] === 'no'}
              onChange={handleSingleSelection}>No</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name='17a' 
              value='unknown'
              checked={input['17a'] === 'unknown'}
              onChange={handleSingleSelection}>Unknown</InlineRadio>
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>If yes, is Consumer Taking Medication?</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='17b'
              value='yes'
              checked={input['17b'] === 'yes'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name='17b' 
              value='no'
              checked={input['17b'] === 'no'}
              onChange={handleSingleSelection}>No</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name='17b' 
              value='unknown'
              checked={input['17b'] === 'unknown'}
              onChange={handleSingleSelection}>Unknown</InlineRadio>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>18. Does Consumer Have Previous Psychiatric Hospital Admission?</TitleLabel>
          <InlineRadio
              inline
              type='radio'
              data-section={section}
              name={18}
              value='yes'
              checked={input[18] === 'yes'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              type='radio'
              data-section={section}
              name={18}
              value='no'
              checked={input[18] === 'no'}
              onChange={handleSingleSelection}>No</InlineRadio>
          <InlineRadio
              inline
              type='radio'
              data-section={section}
              name={18} 
              value='unknown'
              checked={input[18] === 'unknown'}
              onChange={handleSingleSelection}>Unknown</InlineRadio>
        </InputWrapper>

        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>19. Self Diagnosis</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name='19a'
                  value='bipolar'
                  checked={input['19a'].indexOf('bipolar') !== -1}
                  onChange={handleCheckboxChange}>Bipolar</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name='19a'
                  value='depression'
                  checked={input['19a'].indexOf('depression') !== -1}
                  onChange={handleCheckboxChange}>Depression</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name='19a' 
                  value='ptsd'
                  checked={input['19a'].indexOf('ptsd') !== -1}
                  onChange={handleCheckboxChange}>PTSD</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name='19a'
                  value='schizophrenia'
                  checked={input['19a'].indexOf('schizophrenia') !== -1}
                  onChange={handleCheckboxChange}>Schizophrenia</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name='19a'
                  value='dementia'
                  checked={input['19a'].indexOf('dementia') !== -1}
                  onChange={handleCheckboxChange}>Dementia</InlineCheckbox>
            </FormGroup>
            <OtherWrapper>
              <InlineCheckbox
                  data-section={section}
                  name='19a' 
                  value='other'
                  checked={input['19a'].indexOf('other') !== -1}
                  onChange={handleCheckboxChange}>Other:</InlineCheckbox>
              <TextInput data-section={section} name='19b' value={input['19b']} onChange={handleInput} />
            </OtherWrapper>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>20. Armed with Weapon?</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='20a'
              value='yes'
              checked={input['20a'] === 'yes'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name='20a'
              value='no'
              checked={input['20a'] === 'no'}
              onChange={handleSingleSelection}>No</InlineRadio>
        </InputWrapper>
        <InputWrapper flex={FLEX['100']}>
          <Label>If Yes, Weapon Type</Label>
          <TextInput data-section={section} name='20b' value={input['20b']} onChange={handleInput} />
        </InputWrapper>

        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>21. Have Access to Weapons?</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='21a'
              value='yes'
              checked={input['21a'] === 'yes'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name='21a'
              value='no'
              checked={input['21a'] === 'no'}
              onChange={handleSingleSelection}>No</InlineRadio>
        </InputWrapper>
        <InputWrapper flex={FLEX['100']}>
          <Label>If Yes, Weapon Type</Label>
          <TextInput data-section={section} name='21b' value={input['20b']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['1_2']}>
          <TitleLabel>22. Observed Behaviors (Check all that apply)</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='22a'
                value='disorientation'
                checked={input['22a'].indexOf('disorientation') !== -1}
                onChange={handleCheckboxChange}>Disorientation / Confusion</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22a'
                value='abnormalBehavior'
                checked={input['22a'].indexOf('abnormalBehavior') !== -1}
                onChange={handleCheckboxChange}>Abnormal Behavior / Appearance (neglect self-care)</InlineCheckbox>
          </FormGroup>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='22a' 
                value='hearingVoices'
                checked={input['22a'].indexOf('hearingVoices') !== -1}
                onChange={handleCheckboxChange}>Hearing Voices / Hallucinating</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22a'
                value='anxious'
                checked={input['22a'].indexOf('anxious') !== -1}
                onChange={handleCheckboxChange}>Anxious / Excited / Agitated</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22a'
                value='depressed'
                checked={input['22a'].indexOf('depressed') !== -1}
                onChange={handleCheckboxChange}>Depressed Mood</InlineCheckbox>
          </FormGroup>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='22a'
                value='paranoid'
                checked={input['22a'].indexOf('paranoid') !== -1}
                onChange={handleCheckboxChange}>Paranoid or Suspicious</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22a'
                value='self-mutilation'
                checked={input['22a'].indexOf('self-mutilation') !== -1}
                onChange={handleCheckboxChange}>Self-mutilation</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22a' 
                value='threatening'
                checked={input['22a'].indexOf('threatening') !== -1}
                onChange={handleCheckboxChange}>Threatening / Violent Towards Others</InlineCheckbox>
            </FormGroup>
          <OtherWrapper>
            <InlineCheckbox
                data-section={section}
                name='22a'
                value='other'
                checked={input['22a'].indexOf('other') !== -1}
                onChange={handleCheckboxChange} />
            <CheckboxLabel>Other:</CheckboxLabel>
            <TextInput data-section={section} name='22b' value={input['22b']} onChange={handleInput} />
          </OtherWrapper>
        </InputWrapper>

        <InputWrapper flex={FLEX['1_2']}>
          <TitleLabel>Emotional State (Check all that apply)</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='22c'
                value='angry'
                checked={input['22c'].indexOf('angry') !== -1}
                onChange={handleCheckboxChange}>Angry</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22c'
                value='afraid'
                checked={input['22c'].indexOf('afraid') !== -1}
                onChange={handleCheckboxChange}>Afraid</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22c' 
                value='apologetic'
                checked={input['22c'].indexOf('apologetic') !== -1}
                onChange={handleCheckboxChange}>Apologetic</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22c'
                value='calm'
                checked={input['22c'].indexOf('calm') !== -1}
                onChange={handleCheckboxChange}>Calm</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22c'
                value='crying'
                checked={input['22c'].indexOf('crying') !== -1}
                onChange={handleCheckboxChange}>Crying</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22c' 
                value='fearful'
                checked={input['22c'].indexOf('fearful') !== -1}
                onChange={handleCheckboxChange}>Fearful</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='22c' 
                value='nervous'
                checked={input['22c'].indexOf('nervous') !== -1}
                onChange={handleCheckboxChange}>Nervous</InlineCheckbox>
          </FormGroup>
          <OtherWrapper>
            <InlineCheckbox
                inline
                data-section={section}
                name='22c'
                value='other'
                checked={input['22c'].indexOf('other') !== -1}
                onChange={handleCheckboxChange}>Other:</InlineCheckbox>
            <TextInput data-section={section} name='22d' value={input['22d']} onChange={handleInput} />
          </OtherWrapper>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>23. Photos Taken Of:</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name={23} 
                value='injuries'
                checked={input[23].indexOf('injuries') !== -1}
                onChange={handleCheckboxChange}>Injuries</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name={23} 
                value='propertyDamage'
                checked={input[23].indexOf('propertyDamage') !== -1}
                onChange={handleCheckboxChange}>Damage / Crime Scene</InlineCheckbox>
          </FormGroup>
        </InputWrapper>

        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>24. Consumer Injuries</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='24a' 
                value='abrasions'
                checked={input['24a'].indexOf('abrasions') !== -1}
                onChange={handleCheckboxChange}>Abrasions</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='24a' 
                value='bruises'
                checked={input['24a'].indexOf('bruises') !== -1}
                onChange={handleCheckboxChange}>Bruises</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='24a' 
                value='complaintsOfPain'
                checked={input['24a'].indexOf('complaintsOfPain') !== -1}
                onChange={handleCheckboxChange}>Complaints of Pain</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='24a' 
                value='concussion'
                checked={input['24a'].indexOf('concussion') !== -1}
                onChange={handleCheckboxChange}>Concussion</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='24a' 
                value='fractures'
                checked={input['24a'].indexOf('fractures') !== -1}
                onChange={handleCheckboxChange}>Fractures</InlineCheckbox>
          </FormGroup>
          <OtherWrapper>
            <InlineCheckbox
                data-section={section}
                name='24a' 
                value='other'
                checked={input['24a'].indexOf('other') !== -1}
                onChange={handleCheckboxChange} />
            <CheckboxLabel>Other:</CheckboxLabel>
            <TextInput data-section={section} name='24b' value={input['24b']} onChange={handleInput} />
          </OtherWrapper>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['1_5']}>
          <TitleLabel>25. Suicidal</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name='25a'
              value='yes'
              checked={input['25a'] === 'yes'}
              onChange={handleSingleSelection}>Yes</InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name='25a'
              value='no'
              checked={input['25a'] === 'no'}
              onChange={handleSingleSelection}>No</InlineRadio>
        </InputWrapper>

        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>If Suicidal:</TitleLabel>
          <InlineCheckbox
              inline
              data-section={section}
              name='25b'
              value='thoughts'
              checked={input['25b'].indexOf('thoughts') !== -1}
              onChange={handleCheckboxChange}>Thoughts</InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name='25b'
              value='threat'
              checked={input['25b'].indexOf('threat') !== -1}
              onChange={handleCheckboxChange}>Threat</InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name='25b'
              value='attempt'
              checked={input['25b'].indexOf('attempt') !== -1}
              onChange={handleCheckboxChange}>Attempt</InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name='25b'
              value='completed'
              checked={input['25b'].indexOf('completed') !== -1}
              onChange={handleCheckboxChange}>Completed</InlineCheckbox>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper flex={FLEX['100']}>
          <TitleLabel>26. Method Used to Attempt, Threaten, or Complete Suicide</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                inline
                data-section={section}
                name='26a'
                value='narcotics'
                checked={input['26a'].indexOf('narcotics') !== -1}
                onChange={handleCheckboxChange}>Narcotics (Prescription or Illicit)</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='26a'
                value='alcohol'
                checked={input['26a'].indexOf('alcohol') !== -1}
                onChange={handleCheckboxChange}>Alcohol</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='26a'
                value='knife'
                checked={input['26a'].indexOf('knife') !== -1}
                onChange={handleCheckboxChange}>Knife / Cutting Tool</InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name='26a'
                value='firearm'
                checked={input['26a'].indexOf('firearm') !== -1}
                onChange={handleCheckboxChange}>Firearm</InlineCheckbox>
          </FormGroup>
          <OtherWrapper>
            <InlineCheckbox
                data-section={section}
                name='26a'
                value='other'
                checked={input['26a'].indexOf('other') !== -1}
                onChange={handleCheckboxChange} />
            <CheckboxLabel>Other:</CheckboxLabel>
            <TextInput data-section={section} name='26b' value={input['26b']} onChange={handleInput} />
          </OtherWrapper>
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

export default ConsumerInfoView;
// TODO: IF 15 is yes -> send copy of report to Homelessoutreach@BaltimorePolice.org
