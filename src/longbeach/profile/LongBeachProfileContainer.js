// @flow
import React, { useEffect, useMemo } from 'react';

import styled from 'styled-components';
import {
  Card,
  CardStack,
  Label,
  PlusButton
} from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import Detail from '../../components/premium/styled/Detail';
import Portrait from '../../components/portrait/Portrait';
import ProfileBanner from '../../containers/profile/ProfileBanner';
import * as FQN from '../../edm/DataModelFqns';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { getAddressFromLocation } from '../../utils/AddressUtils';
import { getImageDataFromEntity } from '../../utils/BinaryUtils';
import { getDateShortFromIsoDate } from '../../utils/DateUtils';
import { getDobFromPerson } from '../../utils/PersonUtils';
import {
  FlexColumn,
  FlexRow,
  ResultSegment
} from '../styled';

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
`;

const StyledFlexColumn = styled(FlexColumn)`
  width: 100%;
  margin-left: 10px;
`;

const LongBeachProfileContainer = () => {
  const selectedPerson = useSelector((store) => store.getIn(['longBeach', 'profile', 'person']));
  const stayAwayLocation = useSelector((store) => store.getIn(['longBeach', 'profile', 'stayAwayLocation']));
  const profilePicture = useSelector((store) => store.getIn(['longBeach', 'profile', 'profilePicture']));
  const probation = useSelector((store) => store.getIn(['longBeach', 'profile', 'probation']));
  const warrant = useSelector((store) => store.getIn(['longBeach', 'profile', 'warrant']));

  // $FlowFixMe
  const dob :string = getDobFromPerson(selectedPerson);
  const race = selectedPerson.getIn([FQN.PERSON_RACE_FQN, 0], '');
  const sex = selectedPerson.getIn([FQN.PERSON_SEX_FQN, 0], '');

  const imageURL = useMemo(() => getImageDataFromEntity(profilePicture), [profilePicture]);

  const { name, address } = getAddressFromLocation(stayAwayLocation);

  // $FlowFixMe
  const probationStart :string = getDateShortFromIsoDate(probation.getIn([FQN.RECOGNIZED_START_DATE, 0]));
  // $FlowFixMe
  const probationEnd :string = getDateShortFromIsoDate(probation.getIn([FQN.RECOGNIZED_END_DATE, 0]));
  const probationStatus = '';

  const warrantType = warrant.getIn([FQN.TYPE_FQN, 0]);

  return (
    <ContentOuterWrapper>
      <ProfileBanner selectedPerson={selectedPerson} noDob />
      <ContentWrapper>
        <CardStack>
          <Card>
            <ResultSegment padding="sm">
              <FlexRow>
                <FlexColumn>
                  <Grid>
                    <Portrait imageUrl={imageURL} height="128" width="96" />
                    <PlusButton mode="primary">Photo</PlusButton>
                  </Grid>
                </FlexColumn>
                <StyledFlexColumn>
                  <Grid>
                    <div>
                      <Label subtle>
                        DOB
                      </Label>
                      <Detail content={dob} isLoading={false} />
                    </div>
                    <div>
                      <Label subtle>
                        Race
                      </Label>
                      <Detail content={race} isLoading={false} />
                    </div>
                    <div>
                      <Label subtle>
                        Sex
                      </Label>
                      <Detail content={sex} isLoading={false} />
                    </div>
                  </Grid>
                </StyledFlexColumn>
              </FlexRow>
            </ResultSegment>
          </Card>
          <div>
            Stay Away Order
            <Card>
              <ResultSegment padding="sm">
                <Grid>
                  <div>
                    <Label subtle>
                      Location Name
                    </Label>
                    <Detail content={name} isLoading={false} />
                  </div>
                  <div>
                    <Label subtle>
                      Location
                    </Label>
                    <Detail content={address} isLoading={false} />
                  </div>
                </Grid>
              </ResultSegment>
            </Card>
          </div>
          <div>
            Probation
            <Card>
              <ResultSegment padding="sm">
                <Grid>
                  <div>
                    <Label subtle>
                      Status
                    </Label>
                    <Detail content={probationStatus} isLoading={false} />
                  </div>
                  <div>
                    <Label subtle>
                      Period
                    </Label>
                    <Detail content={`${probationStart} - ${probationEnd}`} isLoading={false} />
                  </div>
                </Grid>
              </ResultSegment>
            </Card>
          </div>
          <div>
            Warrant
            <Card>
              <ResultSegment padding="sm">
                <Grid>
                  <div>
                    <Label subtle>
                      Type
                    </Label>
                    <Detail content={warrantType} isLoading={false} />
                  </div>
                </Grid>
              </ResultSegment>
            </Card>
          </div>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default LongBeachProfileContainer;
