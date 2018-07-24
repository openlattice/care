import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';

import { DropdownButton, MenuItem } from 'react-bootstrap';

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
  selectedOrganization: PropTypes.string.isRequired,
  organizations: PropTypes.instanceOf(Map).isRequired,
  selectOrganization: PropTypes.func.isRequired
};

export default OrganizationButton;
