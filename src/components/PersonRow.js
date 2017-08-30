/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

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

const FakeAvatar = styled.div`
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

  return (
    <PersonWrapper key={person.id} onClick={() => handlePersonSelection(person)}>
      <FakeAvatar />
      <UserProfileDetails>
        <UserProfileDetailItem><Label>First name:</Label>{ person['nc.PersonGivenName'][0] }</UserProfileDetailItem>
        <UserProfileDetailItem><Label>Last name:</Label>{ person['nc.PersonSurName'][0] }</UserProfileDetailItem>
        <UserProfileDetailItem><Label>Date of Birth:</Label>{ person['nc.PersonBirthDate'][0] }</UserProfileDetailItem>
      </UserProfileDetails>
    </PersonWrapper>
  );
}

export default PersonRow;
