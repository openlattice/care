// @flow

import React, { useCallback } from 'react';

import styled, { css } from 'styled-components';
import { Constants } from 'lattice';
import { Map } from 'immutable';
import { Button, Card, CardSegment } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import {
  faUser,
  faVenusMars,
  faBirthdayCake,
} from '@fortawesome/pro-solid-svg-icons';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Portrait from '../../components/portrait/Portrait';
import LinkButton from '../../components/buttons/LinkButton';
import Detail from '../../components/premium/styled/Detail';
import { useGoToPath } from '../../components/hooks';
import { selectPerson, clearProfile } from '../profile/ProfileActions';
import { getImageDataFromEntity } from '../../utils/BinaryUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import { PERSON_SEX_FQN, PERSON_RACE_FQN } from '../../edm/DataModelFqns';
import {
  CRISIS_PATH,
  PROFILE_ID_PATH,
  PROFILE_PATH,
} from '../../core/router/Routes';
import { media } from '../../utils/StyleUtils';

const { OPENLATTICE_ID_FQN } = Constants;

const StyledSegment = styled(CardSegment)`
  ${media.phone(css`
    flex-direction: column;
  `)}
`;

const Icon = styled(FontAwesomeIcon)`
  margin-left: 8px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  margin: 0 30px;
  font-size: 20px;

  ${media.phone(css`
    font-size: 16px;
    margin: 0 10px;
  `)}
`;

const Name = styled.div`
  font-size: 24px
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  ${media.phone(css`
    font-size: 20px;
  `)}
`;

const Actions = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-rows: 2fr 1fr;

  ${media.phone(css`
    grid-auto-flow: column;
    grid-template-rows: none;
    margin-top: 10px;
  `)}
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const BigButton = styled(Button)`
  flex: 2;
`;

type Props = {
  result :Map;
}

const PersonResult = (props :Props) => {

  const { result } = props;

  const personEKID = result.getIn([OPENLATTICE_ID_FQN, 0]);
  const imageUrl = useSelector((store) => {
    const profilePic = store.getIn(['people', 'profilePicsByEKID', personEKID], Map());
    return getImageDataFromEntity(profilePic);
  });
  const goToProfile = useGoToPath(PROFILE_PATH.replace(PROFILE_ID_PATH, personEKID));
  const dispatch = useDispatch();

  const handleResultClick = useCallback(() => {
    dispatch(clearProfile());
    dispatch(selectPerson(result));
    goToProfile();
  }, [dispatch, goToProfile, result]);

  const fullName = getLastFirstMiFromPerson(result, true);
  // $FlowFixMe
  const dob :string = getDobFromPerson(result, false, '---');
  const sex = result.getIn([PERSON_SEX_FQN, 0]);
  const race = result.getIn([PERSON_RACE_FQN, 0]);

  return (
    <Card>
      <StyledSegment padding="sm">
        <FlexRow>
          <Portrait imageUrl={imageUrl} height="128" width="96" />
          <Details>
            <Name bold uppercase fontSize="24px">{fullName}</Name>
            <Detail content={dob} icon={faBirthdayCake} />
            <Detail content={sex} icon={faVenusMars} />
            <Detail content={race} icon={faUser} />
          </Details>
        </FlexRow>
        <Actions>
          <BigButton mode="secondary" onClick={handleResultClick}>
            View Profile
          </BigButton>
          <LinkButton to={`${CRISIS_PATH}/1`} state={result}>
            New Report
          </LinkButton>
        </Actions>
      </StyledSegment>
    </Card>
  );
};

export default React.memo<Props>(PersonResult);
