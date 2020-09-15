import React from 'react';

import styled, { css } from 'styled-components';
import {
  Breadcrumbs,
  Button,
  CardStack,
  Hooks,
  IconSplash,
  StyleUtils,
} from 'lattice-ui-kit';

import CreateIssueButton from '../../../components/buttons/CreateIssueButton';
import LinkButton from '../../../components/buttons/LinkButton';
import {
  BASIC_PATH,
  EDIT_PATH,
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
} from '../../../core/router/Routes';

const { media } = StyleUtils;
const { useBoolean } = Hooks;

const TabGroup = styled.div`
  margin-right: auto;

  button:first-of-type {
    border-radius: 3px 0 0 3px;
  }

  button:last-of-type {
    border-radius: 0 3px 3px 0;
  }
`;

const getActiveStyles = ({ active }) => {
  if (active) {
    return css`
      background-color: #a6aab2;
      border-color: #a6aab2;
      color: #fff;

      :hover {
        background-color: #a6aab2;
        border-color: #a6aab2;
        color: #fff;
      }
    `;
  }
  return null;
};

const TabButton = styled(Button)`
  border-radius: 0;
  background-color: #e5e5f0;
  ${getActiveStyles};
`;

const ScrollStack = styled(CardStack)`
  overflow-x: auto;
`;

const ActionBar = styled.div`
  display: flex;
  ${media.tablet`
    flex-direction: column;
  `}
`;

const StyledSplash = styled(IconSplash)`
  margin: auto;
`;

const ButtonGroup = styled.div`
  margin-left: auto;

  button:not(:last-child) {
    margin-right: 10px;
  }
`;

const StyledLinkButton = styled(LinkButton)`
  padding: 10px;
  min-width: 0;
  background-color: #e5e5f0;
`;

const ProfileBody = () => {
  return (
    <ScrollStack>
      <ActionBar>
        <TabGroup>
          <TabButton
              active={tab === 'response'}
              name="response-btn"
              type="button"
              onClick={() => setTab('response')}>
            Response
          </TabButton>
          <TabButton
              active={tab === 'history'}
              name="history-btn"
              type="button"
              onClick={() => setTab('history')}>
            History
          </TabButton>
        </TabGroup>
        <ButtonGroup>
          {
            isAuthorized && (
              <StyledLinkButton to={`${match.url}${EDIT_PATH}${BASIC_PATH}`}>
                <FontAwesomeIcon icon={faPen} />
              </StyledLinkButton>
            )
          }
          <CreateIssueButton />
          <Button color="primary" onClick={open}>Create Report</Button>
          <ReportSelectionModal
              selectedPerson={selectedPerson}
              isVisible={isVisible}
              onClose={close} />
        </ButtonGroup>

      </ActionBar>
      {
        // show splash based on report number from person, rather than successful neighbor returns.
        (!numReportsFoundIn || !meetsReportThreshold) && !isLoadingBody
          ? <StyledSplash icon={faFolderOpen} caption={splashCaption} />
          : body
      }
    </ScrollStack>
  );
};

export default ProfileBody;
