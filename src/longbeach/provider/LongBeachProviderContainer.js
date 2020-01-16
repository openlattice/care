// @flow
import React, { useEffect } from 'react';

import { CardStack } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';

import LongBeachProviderCard from './LongBeachProviderCard';
import { getLBProviders } from './LongBeachProviderActions';

import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';

const LongBeachProviderContainer = () => {
  const providers = useSelector((store) => store.getIn(['longBeach', 'providers', 'providers']));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLBProviders());
  }, [dispatch]);

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          {
            providers.map((provider, idx) => {
              return (
                <LongBeachProviderCard key={idx} provider={provider} />
              );
            }).valueSeq()
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default LongBeachProviderContainer;
