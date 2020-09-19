// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';

import { BreadcrumbLink } from '../../../components/breadcrumbs';
import { PROFILE_ID_PATH, PROFILE_VIEW_PATH } from '../../../core/router/Routes';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { getFirstLastFromPerson } from '../../../utils/PersonUtils';

const StyledLink = styled(BreadcrumbLink)`
  :not(:last-child)::after {
    content: ', '
  }
`;

type Props = {
  person :Map;
}

const PersonLink = ({ person } :Props) => {
  const name = getFirstLastFromPerson(person);
  const id = getEntityKeyId(person);
  const to = PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, id);

  return <StyledLink to={to}>{name}</StyledLink>;
};

export default PersonLink;
