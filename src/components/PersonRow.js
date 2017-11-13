import React from 'react';

import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-bootstrap';

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

const PersonRow = ({ person, handlePersonSelection }) => {
  const getRace = () => {
    return RACE[person[PERSON.RACE_FQN][0]];
  };

  const getFormattedDOB = () => {
    return moment(person[PERSON.DOB_FQN][0]).format('MM/DD/YYYY');
  };

  return (
    <PersonWrapper
        onClick={() => {
          handlePersonSelection(person);
        }}>
      <Grid>
        <Row>
          <Col lg={2}>
            <FontAwesome name="id-card-o" size="5x" />
          </Col>
          <Col lg={10}>
            <StyledRow>
              <NameLabel>
                {
                  `${person[PERSON.LAST_NAME_FQN][0]},
                  ${person[PERSON.FIRST_NAME_FQN][0]},
                  ${person[PERSON.MIDDLE_NAME_FQN][0]}`
                }
              </NameLabel>
            </StyledRow>
            <StyledRow>
              <StyledCol lg={6}><Label>ID:</Label>{ person[PERSON.ID_FQN][0] }</StyledCol>
              <StyledCol lg={6}><Label>DOB:</Label>{ getFormattedDOB() }</StyledCol>
            </StyledRow>
            <StyledRow>
              <StyledCol lg={6}><Label>Gender:</Label>{ person[PERSON.SEX_FQN][0] }</StyledCol>
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
    'nc.SubjectIdentification': PropTypes.array.isRequired
  }).isRequired,
  handlePersonSelection: PropTypes.func.isRequired
};

export default PersonRow;
