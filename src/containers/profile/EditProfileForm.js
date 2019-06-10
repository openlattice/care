// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Card,
  CardSegment,
  Colors,
  Input,
  Select,
  Label
} from 'lattice-ui-kit';
import {
  eyeOptions,
  hairOptions,
  raceOptions,
  sexOptions,
} from './constants';

const { PURPLES } = Colors;

const FormGrid = styled.div`
  display: grid;
  grid-gap: 10px 30px;
  grid-template-columns: repeat(3, 1fr);
  flex: 1;
`;

type Props = {
  formData :Map;
  onSubmit :() => void;
  onDiscard :() => void;
}

type State = {
  editedData :Map;
}

class EditProfileForm extends Component<Props, State> {

  handleOnChange = () => {

  }

  render() {
    return (
      <>
        <CardSegment padding="md">
          <FormGrid>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input type="text" id="last-name" onChange={this.handleOnChange} />
            </div>
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input type="text" id="first-name" onChange={this.handleOnChange} />
            </div>
            <div>
              <Label htmlFor="middle-name">Middle Name</Label>
              <Input type="text" id="middle-name" onChange={this.handleOnChange} />
            </div>
          </FormGrid>
        </CardSegment>
        <CardSegment padding="md">
          <FormGrid>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" onChange={this.handleOnChange} />
            </div>
            <div>
              <Label htmlFor="aliases">Aliases</Label>
              <Input type="text" id="aliases" onChange={this.handleOnChange} />
            </div>
          </FormGrid>
        </CardSegment>
        <CardSegment padding="md">
          <FormGrid>
            <div>
              <Label htmlFor="race">Race</Label>
              <Select
                  type="text"
                  inputId="race"
                  menuPortalTarget={document.body}
                  onChange={this.handleOnChange}
                  options={raceOptions} />
            </div>
            <div>
              <Label htmlFor="sex">Sex</Label>
              <Select
                  type="text"
                  inputId="sex"
                  onChange={this.handleOnChange}
                  options={sexOptions} />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input type="text" id="height" onChange={this.handleOnChange} />
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input type="text" id="weight" onChange={this.handleOnChange} />
            </div>
            <div>
              <Label htmlFor="hair-color">Hair Color</Label>
              <Select
                  type="text"
                  inputId="hair-color"
                  onChange={this.handleOnChange}
                  options={hairOptions} />
            </div>
            <div>
              <Label htmlFor="eye-color">Eye Color</Label>
              <Select
                  type="text"
                  inputId="eye-color"
                  onChange={this.handleOnChange}
                  option={eyeOptions} />
            </div>
          </FormGrid>
        </CardSegment>
      </>
    );
  }
}

export default EditProfileForm;
