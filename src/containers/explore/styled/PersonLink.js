// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Typography } from 'lattice-ui-kit';

import { BreadcrumbLink } from '../../../components/breadcrumbs';
import { PROFILE_ID_PATH, PROFILE_VIEW_PATH } from '../../../core/router/Routes';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { getFirstLastFromPerson } from '../../../utils/PersonUtils';

const StyledSpan = styled(Typography)`
  font-size: 0.875rem;
  font-weight: normal;
`;

const DelimitedSpan = styled.span`
  :not(:last-child)::after {
    content: ', ';
  }
`;

type Props = {
  person :Map;
  role :string;
}

const PersonLink = ({ person, role } :Props) => {
  const name = getFirstLastFromPerson(person);
  const id = getEntityKeyId(person);
  const to = PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, id);

  return (
    <DelimitedSpan>
      <BreadcrumbLink to={to}>{name}</BreadcrumbLink>
      { role ? <StyledSpan component="span">{` (${role})`}</StyledSpan> : null }
    </DelimitedSpan>
  );
};

PersonLink.defaultProps = {
  role: ''
};

export default PersonLink;
