import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import styled from 'styled-components';

import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

const StyledOrganizationButton = styled.div`
  position: absolute;
  top: 30px;
  right: 150px;
`;

const OrganizationButton = ({ selectedOrganization, organizations, selectOrganization }) => {
  const organizationOptions = organizations.valueSeq().map((organization) => {
    const orgId = organization.get('id');
    const orgTitle = organization.get('title');
    return (
      <MenuItem
          key={orgId}
          eventKey={orgId}
          onClick={() => {
            selectOrganization(orgId);
          }}>
        {orgTitle}
      </MenuItem>
    );
  });
  const selectedOrgTitle = organizations.getIn([selectedOrganization, 'title'], '');
  return (
    <StyledOrganizationButton>
      <DropdownButton
          id="organizations"
          title={selectedOrgTitle}>
        {organizationOptions}
      </DropdownButton>
    </StyledOrganizationButton>
  );
};

OrganizationButton.propTypes = {
  selectedOrganization: PropTypes.string,
  organizations: PropTypes.instanceOf(Immutable.Map).isRequired,
  selectOrganization: PropTypes.func.isRequired
};

export default OrganizationButton;
