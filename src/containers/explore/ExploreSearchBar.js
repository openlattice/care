// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Colors,
  Input,
  Typography,
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import {
  clearExploreResults,
  exploreCitations,
  exploreContactInformation,
  exploreFile,
  exploreIdentifyingCharacteristics,
  exploreIncidents,
  exploreLocation,
  explorePeople,
  explorePhysicalAppearances,
  explorePoliceCAD,
} from './ExploreActions';

import { useInput } from '../../components/hooks';
import { ContentWrapper } from '../../components/layout';

const { NEUTRAL } = Colors;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid ${NEUTRAL.N100};
`;

const FlexRow = styled.div`
  display: flex;
  margin: 12px 0;
`;

const StyledInput = styled(Input)`
  > .MuiOutlinedInput-root {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const SearchButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const MAX_HITS = 10;

const ExploreSearchBar = () => {
  const dispatch = useDispatch();
  useEffect(() => () => dispatch(clearExploreResults()), [dispatch]);
  const [searchTerm, setSearchTerm] = useInput('');

  const dispatchSearch = (start = 0) => {
    if (searchTerm.trim().length) {
      const payload = {
        searchTerm: searchTerm.trim(),
        start,
        maxHits: MAX_HITS
      };

      dispatch(exploreCitations(payload));
      dispatch(exploreContactInformation(payload));
      dispatch(exploreFile(payload));
      dispatch(exploreIdentifyingCharacteristics(payload));
      dispatch(exploreIncidents(payload));
      dispatch(exploreLocation(payload));
      dispatch(explorePeople(payload));
      dispatch(explorePhysicalAppearances(payload));
      dispatch(explorePoliceCAD(payload));
    }
  };

  const handleOnSearch = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatchSearch();
  };

  return (
    <Panel>
      <ContentWrapper>
        <div>
          <Typography variant="h1">Explore</Typography>
        </div>
        <form>
          <FlexRow>
            <StyledInput
                variant="outlined"
                id="search-input"
                value={searchTerm}
                placeholder="Search by keyword"
                onChange={setSearchTerm} />
            <SearchButton
                color="primary"
                onClick={handleOnSearch}
                type="submit">
              <FontAwesomeIcon icon={faSearch} fixedWidth />
            </SearchButton>
          </FlexRow>
        </form>
      </ContentWrapper>
    </Panel>
  );
};

export default ExploreSearchBar;
