// @flow
import React from 'react';

import styled from 'styled-components';
import { faMinus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Button, CardSegment } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';
import type { UUID } from 'lattice';

import { removePersonFromEncampment } from './EncampmentActions';

import DefaultLink from '../../../components/links/DefaultLink';
import { PROFILE_ID_PATH, PROFILE_VIEW_PATH } from '../../../core/router/Routes';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { getFirstLastFromPerson } from '../../../utils/PersonUtils';

const StyledSegment = styled(CardSegment)`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 auto;
`;

type Props = {
  person :Map;
  livesAtEKID :UUID;
};

const OccupantItem = (props :Props) => {
  const { person, livesAtEKID } = props;
  const dispatch = useDispatch();

  const personEKID = getEntityKeyId(person);
  const name = getFirstLastFromPerson(person);

  const deleteEdge = () => dispatch(removePersonFromEncampment(livesAtEKID));

  return (
    <StyledSegment
        vertical={false}
        padding="10px">
      <DefaultLink to={PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, personEKID)}>{name}</DefaultLink>
      <Button size="small" color="error" variant="outlined" onClick={deleteEdge}>
        <FontAwesomeIcon icon={faMinus} />
      </Button>
    </StyledSegment>
  );
};

export default OccupantItem;
