/*
 * @flow
 */

import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

const StyledOrganizationButton = styled.div`
  position: absolute;
  top: 30px;
  right: 150px;
`;

const OrganizationButton = ({ selectedOrganization, organizations, selectOrganization }) => {
  const organizationOptions = organizations.map((organization) => {
    return (
      <MenuItem
          key={organization.id}
          eventKey={organization.id}
          onClick={() => {
            selectOrganization(organization.id);
          }}>
        {organization.title}
      </MenuItem>
    );
  });
  const selectedOrgTitle = organizations.filter((organization) => {
    return organization.id === selectedOrganization;
  })[0].title;
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
  organizations: PropTypes.array.isRequired,
  selectOrganization: PropTypes.func.isRequired
};

export default OrganizationButton;
