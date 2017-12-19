/*
 * @flow
 */

import React from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { faUserAlt } from '@fortawesome/fontawesome-pro-light';

import { DATA_URL_PREFIX, PERSON } from '../../shared/Consts';

const {
  DOB_FQN,
  FIRST_NAME_FQN,
  ID_FQN,
  LAST_NAME_FQN,
  PICTURE_FQN,
  RACE_FQN,
  SEX_FQN
} = PERSON;

/*
 * styled components
 */

const PersonDetailsSearchResultWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 0 auto;
  margin: 10px 0;
`;

const PersonPictureWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 200px;
`;

const PersonPicture = styled.img`
  max-height: 150px;
`;

const PersonDetailsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 20px;
`;

const PersonInfoHeaders = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  strong {
    font-weight: 600;
  }
`;

const PersonInfoValues = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 0;
  margin-left: 10px;
  span {
    margin: 0;
  }
`;


/*
 * types
 */

type Props = {
  personDetails :Map<*, *>;
};

const PersonDetailsSearchResult = (props :Props) => {

  // TODO: how do we avoid having to hardcode FQNs???
  const pictureStr = props.personDetails.getIn([PICTURE_FQN, 0], '');
  const pictureImgSrc = `${DATA_URL_PREFIX}${pictureStr}`;

  const id = props.personDetails.getIn([ID_FQN, 0], '');
  const firstName = props.personDetails.getIn([FIRST_NAME_FQN, 0], '');
  const lastName = props.personDetails.getIn([LAST_NAME_FQN, 0], '');
  const sex = props.personDetails.getIn([SEX_FQN, 0], '');
  const race = props.personDetails.getIn([RACE_FQN, 0], '');
  const dob = props.personDetails.getIn([DOB_FQN, 0], '');

  let dobFormatted = dob;
  if (dob) {
    dobFormatted = moment(dob).format('MMMM Do YYYY');
  }

  return (
    <PersonDetailsSearchResultWrapper>
      <PersonPictureWrapper>
        {
          (!pictureStr || pictureStr.length <= 0)
            ? <FontAwesomeIcon icon={faUserAlt} size="6x" />
            : <PersonPicture src={pictureImgSrc} role="presentation" />
        }
      </PersonPictureWrapper>
      <PersonDetailsWrapper>
        <PersonInfoHeaders>
          <strong>First Name:</strong>
          <strong>Last Name:</strong>
          <strong>Date of Birth:</strong>
          <strong>Sex:</strong>
          <strong>Race:</strong>
          <strong>Identifier:</strong>
        </PersonInfoHeaders>
        <PersonInfoValues>
          {
            (firstName && firstName.length > 0)
              ? <span>{ firstName }</span>
              : <span>&nbsp;</span>
          }
          {
            (lastName && lastName.length > 0)
              ? <span>{ lastName }</span>
              : <span>&nbsp;</span>
          }
          {
            (dobFormatted && dobFormatted.length > 0)
              ? <span>{ dobFormatted }</span>
              : <span>&nbsp;</span>
          }
          {
            (sex && sex.length > 0)
              ? <span>{ sex }</span>
              : <span>&nbsp;</span>
          }
          {
            (race && race.length > 0)
              ? <span>{ race }</span>
              : <span>&nbsp;</span>
          }
          {
            (id && id.length > 0)
              ? <span>{ id }</span>
              : <span>&nbsp;</span>
          }
        </PersonInfoValues>
      </PersonDetailsWrapper>
    </PersonDetailsSearchResultWrapper>
  );
};

PersonDetailsSearchResult.defaultProps = {
  personDetails: Immutable.Map()
};

PersonDetailsSearchResult.propTypes = {
  personDetails: PropTypes.instanceOf(Immutable.Map)
};

export default PersonDetailsSearchResult;
