// @flow
import React from 'react';

import styled from 'styled-components';
import {
  List,
  Map,
  getIn
} from 'immutable';
import {
  Card,
  CardSegment,
  Typography,
} from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import PersonLink from './styled/PersonLink';

import PhoneLink from '../../components/links/PhoneLink';
import {
  CONTACT_PHONE_NUMBER_FQN,
  DESCRIPTION_FQN,
  EXTENTION_FQN,
  TYPE_FQN,
} from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId } from '../../utils/DataUtils';

const { CONTACT_INFORMATION_FQN } = APP_TYPES_FQNS;

const DetailWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  > span {
    min-width: 100px;
  }
`;

type Props = {
  result :Map;
};

const ContactInformationResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => {
    const peopleByHitEKID = store.getIn([
      'explore', CONTACT_INFORMATION_FQN, 'peopleByHitEKID', entityKeyId
    ], List());
    return peopleByHitEKID
      .map((peopleEKID) => store.getIn(['explore', CONTACT_INFORMATION_FQN, 'peopleByEKID', peopleEKID]));
  });

  const description = getIn(result, [DESCRIPTION_FQN, 0]) || '---';
  const phone = getIn(result, [CONTACT_PHONE_NUMBER_FQN, 0]);
  const ext = getIn(result, [EXTENTION_FQN, 0]);
  const type = getIn(result, [TYPE_FQN, 0]);
  const typeLabel = type ? `${type}: ` : 'Telephone: ';

  return (
    <Card>
      <CardSegment padding="sm">
        <DetailWrapper>
          <Typography component="span">Attached to: </Typography>
          <div>
            { people.map((person) => {
              const id = getEntityKeyId(person);
              return <PersonLink key={id} person={person} />;
            })}
          </div>
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">{typeLabel}</Typography>
          <PhoneLink number={phone} extension={ext} />
        </DetailWrapper>
        <DetailWrapper>
          <Typography component="span">Description: </Typography>
          <Typography>{description}</Typography>
        </DetailWrapper>
      </CardSegment>
    </Card>
  );
};

export default ContactInformationResult;
