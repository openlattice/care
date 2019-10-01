// @flow
import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_ABOUT_PLAN :'SUBMIT_ABOUT_PLAN' = 'SUBMIT_ABOUT_PLAN';
const submitAboutPlan = newRequestSequence(SUBMIT_ABOUT_PLAN);

const GET_RESPONSIBLE_USER :'GET_RESPONSIBLE_USER' = 'GET_RESPONSIBLE_USER';
const getResponsibleUser = newRequestSequence(GET_RESPONSIBLE_USER);

const UPDATE_RESPONSIBLE_USER :'UPDATE_RESPONSIBLE_USER' = 'UPDATE_RESPONSIBLE_USER';
const updateResponsibleUser = newRequestSequence(UPDATE_RESPONSIBLE_USER);

const GET_ABOUT_PLAN :'GET_ABOUT_PLAN' = 'GET_ABOUT_PLAN';
const getAboutPlan = newRequestSequence(GET_ABOUT_PLAN);

const UPDATE_ABOUT_PLAN :'UPDATE_ABOUT_PLAN' = 'UPDATE_ABOUT_PLAN';
const updateAboutPlan = newRequestSequence(UPDATE_ABOUT_PLAN);

export {
  GET_ABOUT_PLAN,
  GET_RESPONSIBLE_USER,
  SUBMIT_ABOUT_PLAN,
  UPDATE_ABOUT_PLAN,
  UPDATE_RESPONSIBLE_USER,
  getAboutPlan,
  getResponsibleUser,
  submitAboutPlan,
  updateAboutPlan,
  updateResponsibleUser,
};
