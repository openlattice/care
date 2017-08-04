/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, TextInput, SelectInput, InputWrapper, Label, InlineCheckbox, InlineRadio, TitleLabel } from '../shared/Layout';

const ConsumerInfoView = ({ section, handleInput, handleSingleSelection, handleCheckboxChange, input }) => {

  return (
    <SectionView header='Consumer Information'>
      <Row>
        <InputWrapper>
          <TitleLabel>13. Consumer Name (Last, First, MI)</TitleLabel>
          <TextInput data-section={section} name='13a' value={input['13a']} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>Residence / Address (Include Apartment Number, City, County, State, Zip) if Applicable</TitleLabel>
          <TextInput data-section={section} name='13b' value={input['13b']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>Consumer Phone Number</TitleLabel>
          <TextInput data-section={section} name='13c' value={input['13c']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>14. Military Status</TitleLabel>
            <InlineRadio
                type='radio'
                data-section={section}
                name='14a'
                value='active'
                checked={input['14a'] === 'active'}
                onChange={handleSingleSelection} />
            <Label>Active</Label>
            <InlineRadio
                type='radio'
                data-section={section}
                name ='14a' 
                value='veteran'
                checked={input['14a'] === 'veteran'}
                onChange={handleSingleSelection} />
            <Label>Veteran</Label>
            <InlineRadio
                type='radio'
                data-section={section}
                name ='14a'
                value='n/a'
                checked={input['14a'] === 'n/a'}
                onChange={handleSingleSelection} />
            <Label>N/A</Label>
          </InputWrapper>

          <InputWrapper>
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

          <InputWrapper>
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

        <InputWrapper>
          <TitleLabel>Age</TitleLabel>
          <TextInput data-section={section} name='14d' value={input['14d']} onChange={handleInput} />
        </InputWrapper>

        <InputWrapper>
          <TitleLabel>DOB</TitleLabel>
          <TextInput data-section={section} name='14e' value={input['14e']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>15. Homeless</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name='15a'
              value='yes'
              checked={input['15a'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name ='15a' 
              value='no'
              checked={input['15a'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>If Yes, Where Do They Usually Sleep / Frequent?</TitleLabel>
          <TextInput data-section={section} name='15b' value={input['15b']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>16. Consumer Using Drugs, Alcohol, Both (If possible, include type of drugs)</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name='16a'
              value='drugs'
              checked={input['16a'] === 'drugs'}
              onChange={handleSingleSelection} />
          <Label>Drugs</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name ='16a' 
              value='alcohol'
              checked={input['16a'] === 'alcohol'}
              onChange={handleSingleSelection} />
          <Label>Alcohol</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name ='16a' 
              value='both'
              checked={input['16a'] === 'both'}
              onChange={handleSingleSelection} />
          <Label>Both</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name ='16a' 
              value='n/a'
              checked={input['16a'] === 'n/a'}
              onChange={handleSingleSelection} />
          <Label>N/A</Label>
        </InputWrapper>

        <InputWrapper>
          <TitleLabel>Drug type</TitleLabel>
          <TextInput data-section={section} name='16b' value={input['16b']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>17. Is Consumer Prescribed Medication?</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name='17a'
              value='yes'
              checked={input['17a'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name='17a'
              value='no'
              checked={input['17a'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name='17a' 
              value='unknown'
              checked={input['17a'] === 'unknown'}
              onChange={handleSingleSelection} />
          <Label>Unknown</Label>
        </InputWrapper>
        <InputWrapper>
          <TitleLabel>If yes, is Consumer Taking Medication?</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name='17b'
              value='yes'
              checked={input['17b'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name='17b' 
              value='no'
              checked={input['17b'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name='17b' 
              value='unknown'
              checked={input['17b'] === 'unknown'}
              onChange={handleSingleSelection} />
          <Label>Unknown</Label> 
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>18. Does Consumer Have Previous Psychiatric Hospital Admission?</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name={18}
              value='yes'
              checked={input[18] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name={18}
              value='no'
              checked={input[18] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name={18} 
              value='unknown'
              checked={input[18] === 'unknown'}
              onChange={handleSingleSelection} />
          <Label>Unknown</Label>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>19. Self Diagnosis</TitleLabel>
          <InlineCheckbox
              type='checkbox'
              data-section={section}
              name='19a'
              value='bipolar'
              checked={input['19a'].indexOf('bipolar') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Bipolar</Label>
          <InlineCheckbox
              data-section={section}
              name='19a'
              value='depression'
              checked={input['19a'].indexOf('depression') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Depression</Label>
          <InlineCheckbox
              data-section={section}
              name='19a' 
              value='ptsd'
              checked={input['19a'].indexOf('ptsd') !== -1}
              onChange={handleCheckboxChange} />
          <Label>PTSD</Label>
          <InlineCheckbox
              data-section={section}
              name='19a'
              value='schizophrenia'
              checked={input['19a'].indexOf('schizophrenia') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Schizophrenia</Label>
          <InlineCheckbox
              data-section={section}
              name='19a'
              value='dementia'
              checked={input['19a'].indexOf('dementia') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Dementia</Label>
          <div>
            <InlineCheckbox
                data-section={section}
                name='19a' 
                value='other'
                checked={input['19a'].indexOf('other') !== -1}
                onChange={handleCheckboxChange} />
            <Label>Other:</Label>
            <TextInput data-section={section} name='19b' value={input['19b']} onChange={handleInput} />
          </div>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>20. Armed with Weapon?</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name='20a'
              value='yes'
              checked={input['20a'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name='20a'
              value='no'
              checked={input['20a'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </InputWrapper>
        <InputWrapper>
          <Label>If Yes, Weapon Type</Label>
          <TextInput data-section={section} name='20b' value={input['20b']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>21. Have Access to Weapons?</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name='21a'
              value='yes'
              checked={input['21a'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name='21a'
              value='no'
              checked={input['21a'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </InputWrapper>
        <InputWrapper>
          <Label>If Yes, Weapon Type</Label>
          <TextInput data-section={section} name='21b' value={input['20b']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>22. Observed Behaviors (Check all that apply)</TitleLabel>
          <InlineCheckbox
              data-section={section}
              name='22a'
              value='disorientation'
              checked={input['22a'].indexOf('disorientation') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Disorientation / Confusion</Label>
          <InlineCheckbox
              data-section={section}
              name='22a'
              value='abnormalBehavior'
              checked={input['22a'].indexOf('abnormalBehavior') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Abnormal Behavior / Appearance (neglect self-care)</Label>
          <InlineCheckbox
              data-section={section}
              name='22a' 
              value='hearingVoices'
              checked={input['22a'].indexOf('hearingVoices') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Hearing Voices / Hallucinating</Label>
          <InlineCheckbox
              data-section={section}
              name='22a'
              value='anxious'
              checked={input['22a'].indexOf('anxious') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Anxious / Excited / Agitated</Label>
          <InlineCheckbox
              data-section={section}
              name='22a'
              value='depressed'
              checked={input['22a'].indexOf('depressed') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Depressed Mood</Label>
          <InlineCheckbox
              data-section={section}
              name='22a'
              value='paranoid'
              checked={input['22a'].indexOf('paranoid') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Paranoid or Suspicious</Label>
          <div>
            <InlineCheckbox
                data-section={section}
                name='22a'
                value='self-mutilation'
                checked={input['22a'].indexOf('self-mutilation') !== -1}
                onChange={handleCheckboxChange} />
            <Label>Self-mutilation</Label>
            <InlineCheckbox
                data-section={section}
                name='22a' 
                value='threatening'
                checked={input['22a'].indexOf('threatening') !== -1}
                onChange={handleCheckboxChange} />
            <Label>Threatening / Violent Towards Others</Label>
            <InlineCheckbox
                data-section={section}
                name='22a'
                value='other'
                checked={input['22a'].indexOf('other') !== -1}
                onChange={handleCheckboxChange} />
            <Label>Other:</Label>
            <TextInput data-section={section} name='22b' value={input['22b']} onChange={handleInput} />
          </div>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>Emotional State (Check all that apply)</TitleLabel>
          <InlineCheckbox
              data-section={section}
              name='22c'
              value='angry'
              checked={input['22c'].indexOf('angry') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Angry</Label>
          <InlineCheckbox
              data-section={section}
              name='22c'
              value='afraid'
              checked={input['22c'].indexOf('afraid') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Afraid</Label>
          <InlineCheckbox
              data-section={section}
              name='22c' 
              value='apologetic'
              checked={input['22c'].indexOf('apologetic') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Apologetic</Label>
          <InlineCheckbox
              data-section={section}
              name='22c'
              value='calm'
              checked={input['22c'].indexOf('calm') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Calm</Label>
          <InlineCheckbox
              data-section={section}
              name='22c'
              value='crying'
              checked={input['22c'].indexOf('crying') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Crying</Label>
          <InlineCheckbox
              data-section={section}
              name='22c' 
              value='fearful'
              checked={input['22c'].indexOf('fearful') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Fearful</Label>
          <InlineCheckbox
              data-section={section}
              name='22c' 
              value='nervous'
              checked={input['22c'].indexOf('nervous') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Nervous</Label>
          <InlineCheckbox
              data-section={section}
              name='22c'
              value='other'
              checked={input['22c'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Other:</Label>
          <TextInput data-section={section} name='22d' value={input['22d']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>23. Photos Taken Of:</TitleLabel>
          <InlineCheckbox
              data-section={section}
              name={23} 
              value='injuries'
              checked={input[23].indexOf('injuries') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Injuries</Label>
          <InlineCheckbox
              data-section={section}
              name={23} 
              value='propertyDamage'
              checked={input[23].indexOf('propertyDamage') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Property Damage / Crime Scene</Label>
        </InputWrapper>

        <InputWrapper>
          <TitleLabel>24. Consumer Injuries</TitleLabel>
          <InlineCheckbox
              data-section={section}
              name='24a' 
              value='abrasions'
              checked={input['24a'].indexOf('abrasions') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Abrasions</Label>
          <InlineCheckbox
              data-section={section}
              name='24a' 
              value='bruises'
              checked={input['24a'].indexOf('bruises') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Bruises</Label>
          <InlineCheckbox
              data-section={section}
              name='24a' 
              value='complaintsOfPain'
              checked={input['24a'].indexOf('complaintsOfPain') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Complaints of Pain</Label>
          <InlineCheckbox
              data-section={section}
              name='24a' 
              value='concussion'
              checked={input['24a'].indexOf('concussion') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Concussion</Label>
          <InlineCheckbox
              data-section={section}
              name='24a' 
              value='fractures'
              checked={input['24a'].indexOf('fractures') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Fractures</Label>
          <InlineCheckbox
              data-section={section}
              name='24a' 
              value='other'
              checked={input['24a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Other:</Label>
          <TextInput data-section={section} name='24b' value={input['24b']} onChange={handleInput} />
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>25. Suicidal</TitleLabel>
          <InlineRadio
              type='radio'
              data-section={section}
              name='25a'
              value='yes'
              checked={input['25a'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
          <InlineRadio
              type='radio'
              data-section={section}
              name='25a'
              value='no'
              checked={input['25a'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </InputWrapper>

        <InputWrapper>
          <TitleLabel>If Suicidal:</TitleLabel>
          <InlineCheckbox
              data-section={section}
              name='25b'
              value='thoughts'
              checked={input['25b'].indexOf('thoughts') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Thoughts</Label>
          <InlineCheckbox
              data-section={section}
              name='25b'
              value='threat'
              checked={input['25b'].indexOf('threat') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Threat</Label>
          <InlineCheckbox
              data-section={section}
              name='25b'
              value='attempt'
              checked={input['25b'].indexOf('attempt') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Attempt</Label>
          <InlineCheckbox
              data-section={section}
              name='25b'
              value='completed'
              checked={input['25b'].indexOf('completed') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Completed</Label>
        </InputWrapper>
      </Row>

      <Row>
        <InputWrapper>
          <TitleLabel>26. Method Used to Attempt, Threaten, or Complete Suicide</TitleLabel>
          <InlineCheckbox
              data-section={section}
              name='26a'
              value='narcotics'
              checked={input['26a'].indexOf('narcotics') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Narcotics (Prescription or Illicit)</Label>
          <InlineCheckbox
              data-section={section}
              name='26a'
              value='alcohol'
              checked={input['26a'].indexOf('alcohol') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Alcohol</Label>
          <InlineCheckbox
              data-section={section}
              name='26a'
              value='knife'
              checked={input['26a'].indexOf('knife') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Knife / Cutting Tool</Label>
          <InlineCheckbox
              data-section={section}
              name='26a'
              value='firearm'
              checked={input['26a'].indexOf('firearm') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Firearm</Label>
          <InlineCheckbox
              data-section={section}
              name='26a'
              value='other'
              checked={input['26a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Other:</Label>
          <TextInput data-section={section} name='26b' value={input['26b']} onChange={handleInput} />
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

export default ConsumerInfoView;
// TODO: IF 15 is yes -> send copy of report to Homelessoutreach@BaltimorePolice.org
