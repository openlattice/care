// @flow
import React, { useRef, useState } from 'react';

import styled from 'styled-components';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map, getIn } from 'immutable';
import {
  Button,
  Fab,
  Hooks,
  IconButton,
  Menu,
  MenuItem,
  NestedMenuItem,
  StyleUtils,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

import IssueModal from '../../issues/issue/IssueModal';
import ReportSelectionModal from '../../people/ReportSelectionModal';
import VisibilityTypes from '../edit/visibility/VisibilityTypes';
import { BASIC_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { STATUS_FQN } from '../../../edm/DataModelFqns';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { putProfileVisibility } from '../edit/visibility/VisibilityActions';
import type { VisibilityType } from '../edit/visibility/VisibilityTypes';

const { media } = StyleUtils;

const { useBoolean } = Hooks;

const ButtonGroup = styled.div`
  margin-left: auto;

  button:not(:last-child) {
    margin-right: 5px;
  }
`;

const MobileFab = styled(Fab)`
  display: none;
  ${media.phone`
    display: inline-flex;
    position: fixed;
    bottom: 16px;
    right: 16px;
    z-index: 1;
  `}
`;

const DesktopButton = styled(Button)`
  ${media.phone`
    display: none;
  `}
`;

type Props = {
  isAuthorized :boolean;
};

const ProfileActionGroup = ({ isAuthorized } :Props) => {
  const assignee = useSelector((store) => store.getIn(['profile', 'about', 'data'], Map()));
  const currentUser = useSelector((store) => store.getIn(['staff', 'currentUser', 'data'], Map()));
  const person = useSelector((store) => store.getIn(['profile', 'basicInformation', 'basics', 'data'], Map()));
  const visibility = useSelector((store) => store.getIn(['profile', 'visibility', 'data'], Map()));

  const visibilityStatus = getIn(visibility, [STATUS_FQN, 0]);

  const match = useRouteMatch();
  const dispatch = useDispatch();
  const [reportSelectionVisible, openReportSelection, closeReportSelection] = useBoolean(false);
  const [createIssueVisible, openCreateIssue, closeCreateIssue] = useBoolean(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef(null);

  const createVisibilityDispatch = (status :VisibilityType) => () => {
    dispatch(putProfileVisibility({
      personEKID: getEntityKeyId(person),
      summarySetEKID: getEntityKeyId(visibility),
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
      <DesktopButton color="primary" onClick={openReportSelection}>Create Report</DesktopButton>
      <MobileFab color="primary" variant="extended" onClick={openReportSelection}>Create Report</MobileFab>
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
            <MenuItem
                selected={visibilityStatus === VisibilityTypes.AUTO || !visibilityStatus}
                onClick={createVisibilityDispatch(VisibilityTypes.AUTO)}>
              Auto
            </MenuItem>
            <MenuItem
                selected={visibilityStatus === VisibilityTypes.PUBLIC}
                onClick={createVisibilityDispatch(VisibilityTypes.PUBLIC)}>
              Public
            </MenuItem>
            <MenuItem
                selected={visibilityStatus === VisibilityTypes.PRIVATE}
                onClick={createVisibilityDispatch(VisibilityTypes.PRIVATE)}>
              Private
            </MenuItem>
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
