/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';

import { PERSON, RACE } from '../shared/Consts';
// import userPhotoPlaceholder from '../images/user-profile-icon.png';

const PersonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0;
  padding-bottom: 10px;
  &:hover {
    background: white;
    cursor: pointer; 
  }
`;

const FakeAvatar = styled.img`
  height: 100px;
  width: 100px;
  background: white;
`;

const Label = styled.span`
  font-weight: bold;
  padding-right: 6px;
`;

const UserProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const UserProfileDetailItem = styled.div`
  margin: 3px 0;
  font-size: 15px;
`;

const UserDetailsWrapper = styled.div`
  display: flex;
`;

const StyledRow = styled(Row)`
  flex: 1;
`;

const StyledCol = styled(Col)`
  flex: 1;
`;

const PersonRow = ({ person, handlePersonSelection }) => {
  // const formatValue = (rawValue) => {
  //   if (rawValue instanceof Array) {
  //     let formattedValue = '';
  //     if (rawValue.length > 0) formattedValue = formattedValue.concat(rawValue[0]);
  //     if (rawValue.length > 1) {
  //       for (let i = 1; i < rawValue.length; i += 1) {
  //         formattedValue = formattedValue.concat(', ').concat(rawValue[i]);
  //       }
  //     }
  //     return formattedValue;
  //   }
  //   return rawValue;
  // }

  // const getFormattedVal = (prop) => {
  //   const value = this.props.row[`${prop.type.namespace}.${prop.type.name}`] || '';
  //   return formatValue(value);
  // }

  // const getFirstNameVal = () => {
  //   return getFormattedVal(this.props.firstName);
  // }

  // const getLastNameVal = () => {
  //   return getFormattedVal(this.props.lastName);
  // }

  // const renderDOB = () => {
  //   if (!this.props.dob) return null;
  //   return (
  //     <div className={styles.userProfileDetailItem}>
  //       <b>Date of Birth:</b> {getFormattedVal(this.props.dob)}
  //     </div>);
  // }

  const getRace = () => {
    return RACE[person[PERSON.RACE_FQN][0]];
  }

  return (
    <PersonWrapper key={person.id} onClick={() => handlePersonSelection(person)}>
      <FakeAvatar />
      <UserProfileDetails>
        <UserProfileDetailItem>
          <Label>
            { `${person[PERSON.LAST_NAME_FQN][0]}, ${person[PERSON.FIRST_NAME_FQN][0]}, ${person[PERSON.MIDDLE_NAME_FQN][0]}` }
          </Label>
        </UserProfileDetailItem>
        <StyledRow>
          <StyledCol lg={6}><Label>ID:</Label>{ person[PERSON.ID_FQN][0] }</StyledCol>
          <StyledCol lg={6}><Label>DOB:</Label>{ person[PERSON.DOB_FQN][0] }</StyledCol>
        </StyledRow>
        <StyledRow>
          <StyledCol lg={6}><Label>Gender:</Label>{ person[PERSON.SEX_FQN][0] }</StyledCol>
          <StyledCol lg={6}><Label>Race:</Label>{ getRace() }</StyledCol>
        </StyledRow>
      </UserProfileDetails>
    </PersonWrapper>
  );
}

export default PersonRow;
