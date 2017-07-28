/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, TextInput, RadioInput, SelectInput, Label } from '../shared/Layout';

const ConsumerInfoView = ({ section, handleInput, handleSingleSelection, handleCheckboxChange, input }) => {

  return (
    <SectionView header='Consumer Information'>
      <Row>
        <Label>13. Consumer Name (Last, First, MI)</Label>
        <TextInput data-section={section} name='13a' value={input['13a']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>Residence / Address (Include Apartment Number, City, County, State, Zip) if Applicable</Label>
        <TextInput data-section={section} name='13b' value={input['13b']} onChange={handleInput} />
        <Label>Consumer Phone Number</Label>
        <TextInput data-section={section} name='13c' value={input['13c']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>14. Military Status</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='14a'
                value='active'
                checked={input['14a'] === 'active'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Active</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='14a' 
                value='veteran'
                checked={input['14a'] === 'veteran'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Veteran</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='14a'
                value='n/a'
                checked={input['14a'] === 'n/a'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>N/A</Label>

          <Label>Gender</Label>
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

          <Label>Race</Label>
          <SelectInput
              componentClass='select'
              placeholder='select'
              data-section={section}
              name='14c'
              value={input['14c']}
              onChange={handleSingleSelection}>
            <option value=''>select</option>
            <option value='americanIndian'>American Indian or Alaska Native</option>
            <option value='asian'>Asian</option>
            <option value='black'>Black or African American</option>
            <option value='hispanic'>Hispanic or Latino</option>
            <option value='nativeHawaiian'>Native Hawaiian or Other Pacific Islander</option>
            <option value='white'>White</option>
            <option value='other'>Other</option>
          </SelectInput>

        <Label>Age</Label>
        <TextInput data-section={section} name='14d' value={input['14d']} onChange={handleInput} />

        <Label>DOB</Label>
        <TextInput data-section={section} name='14e' value={input['14e']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>15. Homeless</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='15a'
                value='yes'
                checked={input['15a'] === 'yes'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Yes</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='15a' 
                value='no'
                checked={input['15a'] === 'no'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>No</Label>
        <Label>If Yes, Where Do They Usually Sleep / Frequent?</Label>
        <TextInput data-section={section} name='15b' value={input['15b']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>16. Consumer Using Drugs, Alcohol, Both (If possible, include type of drugs)</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='16a'
                value='drugs'
                checked={input['16a'] === 'drugs'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Drugs</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='16a' 
                value='alcohol'
                checked={input['16a'] === 'alcohol'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Alcohol</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='16a' 
                value='both'
                checked={input['16a'] === 'both'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Both</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='16a' 
                value='n/a'
                checked={input['16a'] === 'n/a'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>N/A</Label>
          <Label>Drug type</Label>
          <TextInput data-section={section} name='16b' value={input['16b']} onChange={handleInput} />
        </Row>

      <Row>
        <Label>17. Is Consumer Prescribed Medication?</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17a'
                value='yes'
                checked={input['17a'] === 'yes'}
                onChange={handleSingleSelection} />Yes
          </RadioInput>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17a'
                value='no'
                checked={input['17a'] === 'no'}
                onChange={handleSingleSelection} />No
          </RadioInput>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17a' 
                value='unknown'
                checked={input['17a'] === 'unknown'}
                onChange={handleSingleSelection} />Unknown
          </RadioInput>
        <Label>If yes, is Consumer Taking Medication?</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17b'
                value='yes'
                checked={input['17b'] === 'yes'}
                onChange={handleSingleSelection} />
            <Label>Yes</Label>
          </RadioInput>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17b' 
                value='no'
                checked={input['17b'] === 'no'}
                onChange={handleSingleSelection} />
            <Label>No</Label>
          </RadioInput>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17b' 
                value='unknown'
                checked={input['17b'] === 'unknown'}
                onChange={handleSingleSelection} />
            <Label>Unknown</Label> 
          </RadioInput>
      </Row>

      <Row>
        <Label>18. Does Consumer Have Previous Psychiatric Hospital Admission?</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name={18}
                value='yes'
                checked={input[18] === 'yes'}
                onChange={handleSingleSelection} />
            <Label>Yes</Label>
          </RadioInput>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name={18}
                value='no'
                checked={input[18] === 'no'}
                onChange={handleSingleSelection} />
            <Label>No</Label>
          </RadioInput>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name={18} 
                value='unknown'
                checked={input[18] === 'unknown'}
                onChange={handleSingleSelection} />
            <Label>Unknown</Label>
          </RadioInput>
      </Row>

      <Row>
        <Label>19. Self Diagnosis</Label>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a'
                value='bipolar'
                checked={input['19a'].indexOf('bipolar') !== -1}
                onChange={handleCheckboxChange} />
          </RadioInput>
          <Label>Bipolar</Label>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a'
                value='depression'
                checked={input['19a'].indexOf('depression') !== -1}
                onChange={handleCheckboxChange} />
            <Label>Depression</Label>
          </RadioInput>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a' 
                value='ptsd'
                checked={input['19a'].indexOf('ptsd') !== -1}
                onChange={handleCheckboxChange} />
            <Label>PTSD</Label>
          </RadioInput>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a'
                value='schizophrenia'
                checked={input['19a'].indexOf('schizophrenia') !== -1}
                onChange={handleCheckboxChange} />
            <Label>Schizophrenia</Label>
          </RadioInput>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a'
                value='dementia'
                checked={input['19a'].indexOf('dementia') !== -1}
                onChange={handleCheckboxChange} />
            <Label>Dementia</Label>
          </RadioInput>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a' 
                value='other'
                checked={input['19a'].indexOf('other') !== -1}
                onChange={handleCheckboxChange} />Other:
            <TextInput data-section={section} name='19b' value={input['19b']} onChange={handleInput} />
          </RadioInput>
        </Row>

      <Row>
        <Label>20. Armed with Weapon?</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='20a'
              value='yes'
              checked={input['20a'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
        </RadioInput>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='20a'
              value='no'
              checked={input['20a'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </RadioInput>
        <Label>If Yes, Weapon Type</Label>
        <TextInput data-section={section} name='20b' value={input['20b']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>21. Have Access to Weapons?</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='21a'
              value='yes'
              checked={input['21a'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
        </RadioInput>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='21a'
              value='no'
              checked={input['21a'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </RadioInput>
        <Label>If Yes, Weapon Type</Label>
        <TextInput data-section={section} name='21b' value={input['20b']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>22. Observed Behaviors (Check all that apply)</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='disorientation'
              checked={input['22a'].indexOf('disorientation') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Disorientation / Confusion</Label>
        </RadioInput>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='abnormalBehavior'
              checked={input['22a'].indexOf('abnormalBehavior') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Abnormal Behavior / Appearance (neglect self-care)</Label>
        </RadioInput>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a' 
              value='hearingVoices'
              checked={input['22a'].indexOf('hearingVoices') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Hearing Voices / Hallucinating</Label>
        </RadioInput>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='anxious'
              checked={input['22a'].indexOf('anxious') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Anxious / Excited / Agitated</Label>
        </RadioInput>
      </Row>
      <Row>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='depressed'
              checked={input['22a'].indexOf('depressed') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Depressed Mood</Label>
        </RadioInput>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='paranoid'
              checked={input['22a'].indexOf('paranoid') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Paranoid or Suspicious</Label>
        </RadioInput>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='self-mutilation'
              checked={input['22a'].indexOf('self-mutilation') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Self-mutilation</Label>
        </RadioInput>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a' 
              value='threatening'
              checked={input['22a'].indexOf('threatening') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Threatening / Violent Towards Others</Label>
        </RadioInput>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='other'
              checked={input['22a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />
          <Label>Other:</Label>
          <TextInput data-section={section} name='22b' value={input['22b']} onChange={handleInput} />
        </RadioInput>
      </Row>

      <ControlLabel>Emotional State (Check all that apply)
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='angry'
              checked={input['22c'].indexOf('angry') !== -1}
              onChange={handleCheckboxChange} />Angry
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='afraid'
              checked={input['22c'].indexOf('afraid') !== -1}
              onChange={handleCheckboxChange} />Afraid
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c' 
              value='apologetic'
              checked={input['22c'].indexOf('apologetic') !== -1}
              onChange={handleCheckboxChange} />Apologetic
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='calm'
              checked={input['22c'].indexOf('calm') !== -1}
              onChange={handleCheckboxChange} />Calm
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='crying'
              checked={input['22c'].indexOf('crying') !== -1}
              onChange={handleCheckboxChange} />Crying
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c' 
              value='fearful'
              checked={input['22c'].indexOf('fearful') !== -1}
              onChange={handleCheckboxChange} />Fearful
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c' 
              value='nervous'
              checked={input['22c'].indexOf('nervous') !== -1}
              onChange={handleCheckboxChange} />Nervous
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='other'
              checked={input['22c'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />Other:
          <FormControl data-section={section} name='22d' value={input['22d']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>23. Photos Taken Of:
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={23} 
              value='injuries'
              checked={input[23].indexOf('injuries') !== -1}
              onChange={handleCheckboxChange} />Injuries
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={23} 
              value='propertyDamage'
              checked={input[23].indexOf('propertyDamage') !== -1}
              onChange={handleCheckboxChange} />Property Damage / Crime Scene
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>24. Consumer Injuries
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='abrasions'
              checked={input['24a'].indexOf('abrasions') !== -1}
              onChange={handleCheckboxChange} />Abrasions
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='bruises'
              checked={input['24a'].indexOf('bruises') !== -1}
              onChange={handleCheckboxChange} />Bruises
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='complaintsOfPain'
              checked={input['24a'].indexOf('complaintsOfPain') !== -1}
              onChange={handleCheckboxChange} />Complaints of Pain
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='concussion'
              checked={input['24a'].indexOf('concussion') !== -1}
              onChange={handleCheckboxChange} />Concussion
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='fractures'
              checked={input['24a'].indexOf('fractures') !== -1}
              onChange={handleCheckboxChange} />Fractures
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='other'
              checked={input['24a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />Other:
          <FormControl data-section={section} name='24b' value={input['24b']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>25. Suicidal
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='25a'
              value='yes'
              checked={input['25a'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='25a'
              value='no'
              checked={input['25a'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>If Suicidal:
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='25b'
              value='thoughts'
              checked={input['25b'].indexOf('thoughts') !== -1}
              onChange={handleCheckboxChange} />Thoughts
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='25b'
              value='threat'
              checked={input['25b'].indexOf('threat') !== -1}
              onChange={handleCheckboxChange} />Threat
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='25b'
              value='attempt'
              checked={input['25b'].indexOf('attempt') !== -1}
              onChange={handleCheckboxChange} />Attempt
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='25b'
              value='completed'
              checked={input['25b'].indexOf('completed') !== -1}
              onChange={handleCheckboxChange} />Completed
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>26. Method Used to Attempt, Threaten, or Complete Suicide
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='narcotics'
              checked={input['26a'].indexOf('narcotics') !== -1}
              onChange={handleCheckboxChange} />Narcotics (Prescription or Illicit)
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='alcohol'
              checked={input['26a'].indexOf('alcohol') !== -1}
              onChange={handleCheckboxChange} />Alcohol
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='knife'
              checked={input['26a'].indexOf('knife') !== -1}
              onChange={handleCheckboxChange} />Knife / Cutting Tool
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='firearm'
              checked={input['26a'].indexOf('firearm') !== -1}
              onChange={handleCheckboxChange} />Firearm
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='other'
              checked={input['26a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />Other:
          <FormControl data-section={section} name='26b' value={input['26b']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>
    </SectionView>
  );
}

export default ConsumerInfoView;
// NEXT: FIX CHECKBOX LABEL ALIGNMENT
// TODO: IF 15 is yes -> send copy of report to Homelessoutreach@BaltimorePolice.org
