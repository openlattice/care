// @flow
import React, { useRef, useState } from 'react';

import styled from 'styled-components';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Button,
  Hooks,
  IconButton,
  Menu,
  MenuItem,
  NestedMenuItem,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

import IssueModal from '../../issues/issue/IssueModal';
import ReportSelectionModal from '../../people/ReportSelectionModal';
import VisibilityTypes from '../edit/visibility/VisibilityTypes';
import { BASIC_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { putProfileVisibility } from '../edit/visibility/VisibilityActions';
import type { VisibilityType } from '../edit/visibility/VisibilityTypes';

const { useBoolean } = Hooks;

const ButtonGroup = styled.div`
  margin-left: auto;

  button:not(:last-child) {
    margin-right: 5px;
  }
`;
type Props = {
  isAuthorized :boolean;
};

const ProfileActionGroup = ({ isAuthorized } :Props) => {
  const assignee = useSelector((store) => store.getIn(['profile', 'about', 'data'], Map()));
  const currentUser = useSelector((store) => store.getIn(['staff', 'currentUser', 'data'], Map()));
  const person = useSelector((store) => store.getIn(['profile', 'basicInformation', 'basics', 'data'], Map()));
  const visibility = useSelector((store) => store.getIn(['profile', 'visibility', 'data'], Map()));

  const match = useRouteMatch();
  const dispatch = useDispatch();
  const [reportSelectionVisible, openReportSelection, closeReportSelection] = useBoolean(false);
  const [createIssueVisible, openCreateIssue, closeCreateIssue] = useBoolean(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef(null);

  const createVisibilityDispatch = (status :VisibilityType) => () => {
    dispatch(putProfileVisibility({
      entityKeyId: getEntityKeyId(visibility),
      status
    }));
  };

  const handleToggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setMenuOpen(false);
  };

  const handleOpenCreateIssue = () => {
    setMenuOpen(false);
    openCreateIssue();
  };

  return (
    <ButtonGroup>
      <Button color="primary" onClick={openReportSelection}>Create Report</Button>
      <IconButton
          aria-controls={isMenuOpen ? 'button-action-menu' : undefined}
          aria-expanded={isMenuOpen ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label="select additional action"
          onClick={handleToggleMenu}
          ref={anchorRef}
          variant="text">
        <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
      </IconButton>
      <Menu
          elevation={4}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          anchorEl={anchorRef.current}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
        <MenuItem disabled={!isAuthorized} component={Link} to={`${match.url}${EDIT_PATH}${BASIC_PATH}`}>
          Edit Profile
        </MenuItem>
        <MenuItem onClick={handleOpenCreateIssue}>Create Issue</MenuItem>
        {isAuthorized && (
          <NestedMenuItem elevation={4} label="Visibility" parentMenuOpen={!!isMenuOpen}>
            <MenuItem onClick={createVisibilityDispatch(VisibilityTypes.AUTO)}>Auto</MenuItem>
            <MenuItem onClick={createVisibilityDispatch(VisibilityTypes.PUBLIC)}>Public</MenuItem>
            <MenuItem onClick={createVisibilityDispatch(VisibilityTypes.PRIVATE)}>Private</MenuItem>
          </NestedMenuItem>
        )}
      </Menu>
      <ReportSelectionModal
          selectedPerson={person}
          isVisible={reportSelectionVisible}
          onClose={closeReportSelection} />
      <IssueModal
          assignee={assignee}
          currentUser={currentUser}
          isVisible={createIssueVisible}
          onClose={closeCreateIssue}
          person={person} />
    </ButtonGroup>
  );
};

export default ProfileActionGroup;
