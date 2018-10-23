/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { DatePicker } from '@atlaskit/datetime-picker';

import StyledInput from '../controls/StyledInput';
import InfoButton from '../buttons/InfoButton';

const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  padding: 20px;
`;

const SearchRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  margin: 10px;
  width: 100%;
`;

const TitleLabel = styled.div`
  color: #37454a;
  font-size: 16px;
  font-weight: 400;
  display: block;
  color: #555e6f;
  margin-bottom: 10px;
`;

const DatePickerWrapper = styled.div`
  width: 100%;
`;

type Props = {
  firstName :string,
  lastName :string,
  dob :string,
  handleSubmit :(firstName :string, lastName :string, dob :string) => void,
};

type State = {
  firstName :string,
  lastName :string,
  dob :string
}

export default class PersonSearchFields extends React.Component<Props, State> {

  constructor(props :Props) {
    const firstName = props.firstName ? props.firstName : '';
    const lastName = props.lastName ? props.lastName : '';
    const dob = props.dob ? props.dob : '';
    super(props);
    this.state = {
      firstName,
      lastName,
      dob
    };
  }

  handleSubmit = () => {
    const { firstName, lastName, dob } = this.state;
    this.props.handleSubmit(firstName, lastName, dob);
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onDobChange = (dob :string) => {
    this.setState({ dob });
  }

  render() {
    const { firstName, lastName, dob } = this.state;

    return (
      <SearchRow>
        <Col>
          <TitleLabel>Last name</TitleLabel>
          <StyledInput name="lastName" onKeyPress={this.handleKeyPress} onChange={this.onChange} value={lastName} />
        </Col>
        <Col>
          <TitleLabel>First name</TitleLabel>
          <StyledInput name="firstName" onKeyPress={this.handleKeyPress} onChange={this.onChange} value={firstName} />
        </Col>
        <Col>
          <TitleLabel>Date of birth</TitleLabel>
          <DatePickerWrapper>
            <DatePicker
                value={dob}
                name="dob"
                dateFormat="MM/DD/YYYY"
                onChange={this.onDobChange}
                onKeyPress={this.handleKeyPress}
                selectProps={{
                  placeholder: 'MM/DD/YYYY',
                }} />
          </DatePickerWrapper>
        </Col>
        <Col>
          <InfoButton onClick={this.handleSubmit}>Search</InfoButton>
        </Col>
      </SearchRow>
    );
  }
}
