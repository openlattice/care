import React from 'react';

import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-bootstrap';

import { DATA_URL_PREFIX } from './SelfieWebCam';
import { PERSON, RACE } from '../shared/Consts';

const PersonWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 5px;
  &:hover {
    background: white;
    cursor: pointer;
  }
`;

const Label = styled.span`
  font-weight: bold;
  padding-right: 6px;
`;

const NameLabel = Label.extend`
  font-size: 18px;
`;

const StyledRow = styled(Row)`
  margin-bottom: 10px;
`;

const StyledCol = styled(Col)`
  padding: 0;
`;

const ConsumerPicture = styled.img`
  max-height: 150px;
`;

const PersonRow = ({ person, handlePersonSelection }) => {

  const personId = person[PERSON.ID_FQN][0];

  let firstName = '';
  if (person[PERSON.FIRST_NAME_FQN] && person[PERSON.FIRST_NAME_FQN].length > 0) {
    firstName = person[PERSON.FIRST_NAME_FQN][0];
  }

  let lastName = '';
  if (person[PERSON.LAST_NAME_FQN] && person[PERSON.LAST_NAME_FQN].length > 0) {
    lastName = person[PERSON.LAST_NAME_FQN][0];
  }

  let middleName = '';
  if (person[PERSON.MIDDLE_NAME_FQN] && person[PERSON.MIDDLE_NAME_FQN].length > 0) {
    middleName = person[PERSON.MIDDLE_NAME_FQN][0];
  }

  let sex = '';
  if (person[PERSON.SEX_FQN] && person[PERSON.SEX_FQN].length > 0) {
    sex = person[PERSON.SEX_FQN][0];
  }

  const getRace = () => {
    if (person[PERSON.RACE_FQN] && person[PERSON.RACE_FQN].length > 0) {
      return RACE[person[PERSON.RACE_FQN][0]];
    }
    return '';
  };

  const getFormattedDOB = () => {
    if (person[PERSON.DOB_FQN] && person[PERSON.DOB_FQN].length > 0) {
      return moment(person[PERSON.DOB_FQN][0]).format('MM/DD/YYYY');
    }
    return '';
  };

  let pictureDataUrl = null;
  if (person[PERSON.PICTURE_FQN] && person[PERSON.PICTURE_FQN].length > 0) {
    pictureDataUrl = `${DATA_URL_PREFIX}${person[PERSON.PICTURE_FQN][0]}`;
  }

  return (
    <PersonWrapper
        onClick={() => {
          handlePersonSelection(person);
        }}>
      <Grid>
        {
          pictureDataUrl !== null
            ? (
              <StyledRow>
                <Col lg={12}>
                  <ConsumerPicture
                      alt="Consumer Picture"
                      src={pictureDataUrl} />
                </Col>
              </StyledRow>
            )
            : null
        }
        <Row>
          <Col lg={10}>
            <StyledRow>
              <NameLabel>
                {
                  `${lastName},
                  ${firstName},
                  ${middleName}`
                }
              </NameLabel>
            </StyledRow>
            <StyledRow>
              <StyledCol lg={6}><Label>ID:</Label>{ personId }</StyledCol>
              <StyledCol lg={6}><Label>DOB:</Label>{ getFormattedDOB() }</StyledCol>
            </StyledRow>
            <StyledRow>
              <StyledCol lg={6}><Label>Gender:</Label>{ sex }</StyledCol>
              <StyledCol lg={6}><Label>Race:</Label>{ getRace() }</StyledCol>
            </StyledRow>
          </Col>
        </Row>
      </Grid>
    </PersonWrapper>
  );
};

PersonRow.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.array.isRequired,
    'nc.PersonBirthDate': PropTypes.array.isRequired,
    'nc.PersonGivenName': PropTypes.array.isRequired,
    'nc.PersonMiddleName': PropTypes.array.isRequired,
    'nc.PersonRace': PropTypes.array.isRequired,
    'nc.PersonSex': PropTypes.array.isRequired,
    'nc.PersonSurName': PropTypes.array.isRequired,
    'nc.SubjectIdentification': PropTypes.array.isRequired,
    'person.age': PropTypes.array.isRequired
  }).isRequired,
  handlePersonSelection: PropTypes.func.isRequired
};

export default PersonRow;
