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

import DeleteReportModal from '../crisis/DeleteReportModal';
import { useAuthorization } from '../../../components/hooks';
import { PRIVATE_SETTINGS } from '../../settings/constants';

const CLOSE_XML_EXPORT = 'CLOSE_XML_EXPORT';
const CLOSE_MENU = 'CLOSE_MENU';
const OPEN_XML_EXPORT = 'OPEN_XML_EXPORT';
const OPEN_MENU = 'OPEN_MENU';
const OPEN_DELETE_REPORT = 'OPEN_DELETE_REPORT';
const CLOSE_DELETE_REPORT = 'CLOSE_DELETE_REPORT';

const INITIAL_STATE = {
  deleteReportOpen: false,
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
        ...state,
        menuOpen: false,
        xmlExportOpen: true,
      };
    case OPEN_DELETE_REPORT:
      return {
        ...state,
        menuOpen: false,
        deleteReportOpen: true,
      };
    case CLOSE_DELETE_REPORT:
      return {
        ...state,
        deleteReportOpen: false,
      };
    default:
      return state;
  }
};

type Props = {
  noExport ?:boolean;
  onDeleteReport :() => any;
  profilePath :string;
};

const ReportMenuButton = ({
  noExport,
  onDeleteReport,
  profilePath,
} :Props) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const anchorRef = useRef(null);
  const [isAuthorized] = useAuthorization(PRIVATE_SETTINGS.deleteReports);

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

  const handleOpenDeleteReport = () => {
    dispatch({ type: OPEN_DELETE_REPORT });
  };

  const handleCloseDeleteReport = () => {
    dispatch({ type: CLOSE_DELETE_REPORT });
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
        {
          !noExport && (
            <MenuItem onClick={handleOpenXMLExport}>
              Export as XML
            </MenuItem>
          )
        }
        <MenuItem disabled={!isAuthorized} onClick={handleOpenDeleteReport}>
          Delete Report
        </MenuItem>
      </Menu>
      <ExportXMLModal
          isVisible={state.xmlExportOpen}
          onClose={handleCloseXMLExport} />
      <DeleteReportModal
          isVisible={state.deleteReportOpen}
          onClickPrimary={onDeleteReport}
          onClose={handleCloseDeleteReport}
          profilePath={profilePath} />
    </>
  );
};

ReportMenuButton.defaultProps = {
  noExport: false,
};

export default ReportMenuButton;
