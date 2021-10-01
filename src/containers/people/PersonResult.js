// @flow

import React from 'react';

import isFunction from 'lodash/isFunction';
import styled from 'styled-components';
import {
  faBirthdayCake,
  faFileExclamation,
  faHistory,
  faUser,
  faVenusMars,
} from '@fortawesome/pro-solid-svg-icons';
import { Map } from 'immutable';
import { Constants } from 'lattice';
import { Button, Card, CardSegment } from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import IconDetail from '../../components/premium/styled/IconDetail';
import Portrait from '../../components/portrait/Portrait';
import { useAppSettings, useGoToPath } from '../../components/hooks';
import {
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
} from '../../core/router/Routes';
import {
  NUM_REPORTS_FOUND_IN_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN
} from '../../edm/DataModelFqns';
import { getImageDataFromEntity } from '../../utils/BinaryUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import { media } from '../../utils/StyleUtils';
import { clearProfile, selectPerson } from '../profile/ProfileActions';

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
  font-size: 16px;
  margin: 0 30px;
  min-width: 0;
  ${media.phone`
    font-size: 12px;
    margin: 0 10px;
  `}
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  ${media.phone`
    font-size: 18px;
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
  onClick ?:(result :Map) => void;
  result :Map;
}

const PersonResult = (props :Props) => {

  const { result, onClick } = props;

  const personEKID = result.getIn([OPENLATTICE_ID_FQN, 0]);
  const imageUrl = useSelector((store) => {
    const profilePic = store.getIn(['people', 'profilePicsByEKID', personEKID], Map());
    return getImageDataFromEntity(profilePic);
  });
  const recentIncident = useSelector((store) => store
    .getIn(['people', 'recentIncidentsByEKID', 'data', personEKID, 'recentIncidentDT']));

  const isLoading = useSelector((store) => store
    .getIn(['people', 'recentIncidentsByEKID', 'fetchState']) !== RequestStates.SUCCESS);

  const [settings] = useAppSettings();
  const profileModule = settings.get('profileModule', 'crisis');

  const showDetails = profileModule !== 'helpline';

  const goToProfile = useGoToPath(PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, personEKID));
  const dispatch = useDispatch();

  const handleClick = () => {
    if (isFunction(onClick)) {
      onClick(result);
    }
  };

  const handleViewProfile = () => {
    dispatch(clearProfile());
    dispatch(selectPerson(result));
    goToProfile();
  };

  const fullName = getLastFirstMiFromPerson(result, true);
  const dob :string = getDobFromPerson(result, '---');
  const sex = result.getIn([PERSON_SEX_FQN, 0]);
  const race = result.getIn([PERSON_RACE_FQN, 0]);
  const recentDate = (recentIncident && recentIncident.isValid) && recentIncident.toLocaleString(DateTime.DATE_SHORT);
  const numSources = result.getIn([NUM_REPORTS_FOUND_IN_FQN, 0]);

  return (
    <Card>
      <StyledSegment vertical={false} padding="sm">
        <FlexRow>
          <Portrait imageUrl={imageUrl} height="128" width="96" />
          <Details>
            <Name bold uppercase fontSize="24px">{fullName}</Name>
            <IconDetail content={dob} icon={faBirthdayCake} isLoading={isLoading} />
            <IconDetail content={sex} icon={faVenusMars} isLoading={isLoading} />
            <IconDetail content={race} icon={faUser} isLoading={isLoading} />
            {
              showDetails && (
                <>
                  <IconDetail content={recentDate} icon={faHistory} isLoading={isLoading} />
                  <IconDetail content={numSources} icon={faFileExclamation} isLoading={isLoading} />
                </>
              )
            }
          </Details>
        </FlexRow>
        <Actions>
          <BigButton color="secondary" onClick={handleViewProfile}>
            View Profile
          </BigButton>
          {
            showDetails && (
              <Button onClick={handleClick}>
                New Report
              </Button>
            )
          }
        </Actions>
      </StyledSegment>
    </Card>
  );
};

PersonResult.defaultProps = {
  onClick: () => {}
};

export default React.memo<Props>(PersonResult);
