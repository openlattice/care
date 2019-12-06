// @flow

import React, { useCallback } from 'react';

import styled from 'styled-components';
import { Constants } from 'lattice';
import { Map, getIn } from 'immutable';
import { Button, Card, CardSegment } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import {
  faUser,
  faVenusMars,
  faBirthdayCake,
} from '@fortawesome/pro-solid-svg-icons';

import Portrait from '../../components/portrait/Portrait';
import Detail from '../../components/premium/styled/Detail';
import { SUBJECT_INFORMATION } from '../../utils/constants/CrisisReportConstants';
import { getImageDataFromEntity } from '../../utils/BinaryUtils';
import { getPersonAge, getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import { selectPerson, clearProfile } from '../profile/ProfileActions';
import { setInputValues } from '../pages/subjectinformation/ActionFactory';
import { useGoToPath } from '../../components/hooks';
import {
  PERSON_DOB_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_ID_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_NICK_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_SSN_LAST_4_FQN,
} from '../../edm/DataModelFqns';
import {
  CRISIS_PATH,
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
} from '../../core/router/Routes';
import { media } from '../../utils/StyleUtils';

const { OPENLATTICE_ID_FQN } = Constants;

const StyledSegment = styled(CardSegment)`
  ${media.phone`
    flex-direction: column;
  `}
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  margin: 0 30px;
  font-size: 20px;

  ${media.phone`
    font-size: 16px;
    margin: 0 10px;
  `}
`;

const Name = styled.div`
  font-size: 24px
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  ${media.phone`
    font-size: 20px;
  `}
`;

const Actions = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-rows: 2fr 1fr;

  ${media.phone`
    grid-auto-flow: column;
    grid-template-rows: none;
    margin-top: 10px;
  `}
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
  const goToProfile = useGoToPath(PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, personEKID));
  const goToReport = useGoToPath(`${CRISIS_PATH}/1`);
  const dispatch = useDispatch();

  const handleViewProfile = useCallback(() => {
    dispatch(clearProfile());
    dispatch(selectPerson(result));
    goToProfile();
  }, [dispatch, goToProfile, result]);

  const handleNewReport = useCallback(() => {
    const isNewPerson = getIn(result, ['isNewPerson', 0]) || false;
    const age = getPersonAge(result);

    dispatch(setInputValues({
      [SUBJECT_INFORMATION.PERSON_ID]: getIn(result, [PERSON_ID_FQN, 0], ''),
      [SUBJECT_INFORMATION.FULL_NAME]: getLastFirstMiFromPerson(result),
      [SUBJECT_INFORMATION.FIRST]: getIn(result, [PERSON_FIRST_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.LAST]: getIn(result, [PERSON_LAST_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.MIDDLE]: getIn(result, [PERSON_MIDDLE_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.AKA]: getIn(result, [PERSON_NICK_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.DOB]: getIn(result, [PERSON_DOB_FQN, 0], ''),
      [SUBJECT_INFORMATION.RACE]: getIn(result, [PERSON_RACE_FQN, 0], ''),
      [SUBJECT_INFORMATION.GENDER]: getIn(result, [PERSON_SEX_FQN, 0], ''),
      [SUBJECT_INFORMATION.AGE]: age,
      [SUBJECT_INFORMATION.SSN_LAST_4]: getIn(result, [PERSON_SSN_LAST_4_FQN, 0], ''),
      [SUBJECT_INFORMATION.IS_NEW_PERSON]: isNewPerson
    }));
    dispatch(selectPerson(result));
    goToReport();
  }, [dispatch, goToReport, result]);

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
          <BigButton mode="secondary" onClick={handleViewProfile}>
            View Profile
          </BigButton>
          <Button mode="positive" onClick={handleNewReport}>
            New Report
          </Button>
        </Actions>
      </StyledSegment>
    </Card>
  );
};

export default React.memo<Props>(PersonResult);
