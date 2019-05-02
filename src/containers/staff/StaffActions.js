// @flow

import { newRequestSequence } from 'redux-reqseq';

const ADD_NEW_STAFF_MEMBER = 'ADD_NEW_STAFF_MEMBER';
const addNewStaffMember = newRequestSequence(ADD_NEW_STAFF_MEMBER);

const GET_CURRENT_USER_STAFF_MEMBER_DATA = 'GET_CURRENT_USER_STAFF_MEMBER_DATA';
const getCurrentUserStaffMemberData = newRequestSequence(GET_CURRENT_USER_STAFF_MEMBER_DATA);

export {
  ADD_NEW_STAFF_MEMBER,
  GET_CURRENT_USER_STAFF_MEMBER_DATA,
  addNewStaffMember,
  getCurrentUserStaffMemberData,
};
