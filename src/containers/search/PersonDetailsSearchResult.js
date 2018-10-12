/*
 * @flow
 */

import React from 'react';

import moment from 'moment';
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { faUserCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';

import { DATA_URL_PREFIX } from '../../shared/Consts';
import {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_ID_FQN,
  PERSON_PICTURE_FQN,
} from '../../edm/DataModelFqns';

const { NEUTRALS } = Colors;

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
  color: ${NEUTRALS[3]};
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

const PersonDetailsSearchResult = ({ personDetails } :Props) => {

  // TODO: how do we avoid having to hardcode FQNs???
  const pictureStr = personDetails.getIn([PERSON_PICTURE_FQN, 0], '');
  const pictureImgSrc = pictureStr.startsWith('data:image') ? pictureStr : `${DATA_URL_PREFIX}${pictureStr}`;

  const id = personDetails.getIn([PERSON_ID_FQN, 0], '');
  const firstName = personDetails.getIn([PERSON_FIRST_NAME_FQN, 0], '');
  const lastName = personDetails.getIn([PERSON_LAST_NAME_FQN, 0], '');
  const sex = personDetails.getIn([PERSON_SEX_FQN, 0], '');
  const race = personDetails.getIn([PERSON_RACE_FQN, 0], '');
  const dob = personDetails.getIn([PERSON_DOB_FQN, 0], '');

  let dobFormatted = dob;
  if (dob) {
    dobFormatted = moment(dob).format('MMMM Do YYYY');
  }

  return (
    <PersonDetailsSearchResultWrapper>
      <PersonPictureWrapper>
        {
          (!pictureStr || pictureStr.length <= 0)
            ? <FontAwesomeIcon icon={faUserCircle} size="6x" />
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
  personDetails: Map()
};

export default PersonDetailsSearchResult;
