// @flow
import React, { useReducer, useRef } from 'react';

import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconButton,
  Menu,
  MenuItem,
} from 'lattice-ui-kit';

import ExportXMLModal from './ExportXMLModal';

const CLOSE_XML_EXPORT = 'CLOSE_XML_EXPORT';
const CLOSE_MENU = 'CLOSE_MENU';
const OPEN_XML_EXPORT = 'OPEN_XML_EXPORT';
const OPEN_MENU = 'OPEN_MENU';

const INITIAL_STATE = {
  menuOpen: false,
  xmlExportOpen: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case CLOSE_MENU:
      return {
        ...state,
        menuOpen: false,
      };
    case OPEN_MENU:
      return {
        ...state,
        menuOpen: true,
      };
    case CLOSE_XML_EXPORT:
      return {
        ...state,
        xmlExportOpen: false,
      };
    case OPEN_XML_EXPORT:
      return {
        menuOpen: false,
        xmlExportOpen: true,
      };
    default:
      return state;
  }
};

const ReportMenuButton = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const anchorRef = useRef(null);

  const handleOpenMenu = () => {
    dispatch({ type: OPEN_MENU });
  };

  const handleCloseMenu = () => {
    dispatch({ type: CLOSE_MENU });
  };

  const handleOpenXMLExport = () => {
    dispatch({ type: OPEN_XML_EXPORT });
  };

  const handleCloseXMLExport = () => {
    dispatch({ type: CLOSE_XML_EXPORT });
  };

  return (
    <>
      <IconButton
          aria-controls={state.menuOpen ? 'report-action-menu' : undefined}
          aria-expanded={state.menuOpen ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label="report action button"
          onClick={handleOpenMenu}
          ref={anchorRef}
          variant="text">
        <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
      </IconButton>
      <Menu
          anchorEl={anchorRef.current}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom',
          }}
          elevation={4}
          getContentAnchorEl={null}
          id="report-action-menu"
          onClose={handleCloseMenu}
          open={state.menuOpen}
          transformOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}>
        <MenuItem onClick={handleOpenXMLExport}>
          Export as XML
        </MenuItem>
      </Menu>
      <ExportXMLModal
          isVisible={state.xmlExportOpen}
          onClose={handleCloseXMLExport} />
    </>
  );
};

export default ReportMenuButton;
