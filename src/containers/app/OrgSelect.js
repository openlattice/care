import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import styled from 'styled-components';
import { Map } from 'immutable';

const SelectOuterContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

const SelectInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  width: 900px;
`;

const StyledSelect = styled(Select)`
  margin: 0 20px;
`;

const OrgSelect = ({ onSelect, organizations, selectedOrganization }) => {

  let defaultIndex = 0;
  const organizationOptions = organizations.valueSeq().map((organization, index) => {
    if (organization.get('id') === selectedOrganization) {
      defaultIndex = index;
    }
    return {
      label: organization.get('title'),
      value: organization.get('id'),
    };
  }).toJS();

  const handleOnChange = ({ value: orgId }) => {
    onSelect(orgId);
  };

  return (
    <SelectOuterContainer>
      <SelectInnerContainer>
        <StyledSelect
            defaultValue={organizationOptions[defaultIndex]}
            isClearable={false}
            isMulti={false}
            onChange={handleOnChange}
            options={organizationOptions} />
      </SelectInnerContainer>
    </SelectOuterContainer>
  );
};

OrgSelect.propTypes = {
  organizations: PropTypes.instanceOf(Map).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedOrganization: PropTypes.string.isRequired,
};

export default OrgSelect;
