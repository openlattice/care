// @flow
import React, { useMemo, useState } from 'react';

import styled from 'styled-components';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button, Menu, MenuItem, MenuList
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';

import DropdownButton from '../../components/buttons/DropdownButton';
import { useGoToPath } from '../../components/hooks';
import { PROFILE_ID_PARAM, PROFILE_ID_PATH, PROFILE_VIEW_PATH } from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';

const PROFILE_MODULES = [
  {
    label: 'Crisis',
    path: '/'
  },
  {
    label: 'Helpline',
    path: '/helpline'
  },
];

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const chevron = <FontAwesomeIcon icon={faChevronDown} />;

type Props = {
  title :string;
};

const ModuleSelector = ({ title } :Props) => {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    const module = PROFILE_MODULES[index];
    const path = `${PROFILE_VIEW_PATH}${module.path}`.replace(PROFILE_ID_PATH, profileId || '');
    setAnchorEl(null);
    dispatch(goToPath(path));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { [PROFILE_ID_PARAM]: profileId } = match.params;

  return (
    <Wrapper>
      <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          endIcon={chevron}
          onClick={handleClick}>
        {title}
      </Button>
      <Menu
          id="module-menu"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: -10,
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}>
        {PROFILE_MODULES.map((option, index) => (
          <MenuItem
              key={option.path}
              onClick={(event) => handleMenuItemClick(event, index)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Wrapper>
  );
};

export default ModuleSelector;
