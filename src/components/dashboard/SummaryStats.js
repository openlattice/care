/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

import { SUMMARY_STATS } from '../../shared/Consts';

const SummaryStatsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 300px;
  width: 100%;

  article:first-child {
    width: 300px;
    margin-right: 20px;
  }

  article:last-child {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`;

const StatCardRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 47%;
`;

const StatCard = styled.div`
  height: 100%;
  width: ${props => props.large ? '300px' : '200px'};
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: #ffffff;
  border: 1px solid #e1e1eb;
  padding: 30px 0;
  font-family: 'Open Sans', sans-serif;
  flex-grow: 1;

  h1 {
    font-size: 24px;
    color: #2e2e34;
    margin-bottom: 20px;
    font-weight: normal;
    margin: 0 0 10px 0;
  }

  span:last-child {
    font-size: 13px;
    font-weight: 600;
    color: #8e929b;
    padding: 5px;
    text-align: center;
    text-transform: lowercase;
  }
`;

const SummaryStats = ({ summaryStats }) => {
  const numReports = summaryStats.get(SUMMARY_STATS.NUM_REPORTS);
  const numHomeless = summaryStats.get(SUMMARY_STATS.NUM_HOMELESS);
  const numMale = summaryStats.get(SUMMARY_STATS.NUM_MALE);
  const numVeterans = summaryStats.get(SUMMARY_STATS.NUM_VETERANS);
  const numUsingSubstance = summaryStats.get(SUMMARY_STATS.NUM_USING_SUBSTANCE);
  const numUsingAlcohol = summaryStats.get(SUMMARY_STATS.NUM_USING_ALCOHOL);
  const numUsingDrugs = summaryStats.get(SUMMARY_STATS.NUM_USING_DRUGS);

  const formattedAge = Math.floor(summaryStats.get(SUMMARY_STATS.AVG_AGE) * 100) / 100;

  const formatLabel = (num) => `${num} (${Math.floor(num / numReports * 1000) / 10}%)`;

  return (
    <SummaryStatsWrapper>
      <article>
        <StatCard large>
          <h1>{numReports}</h1>
          <span>reports last month</span>
        </StatCard>
      </article>
      <article>

        <StatCardRow>
          <StatCard>
            <h1>{formattedAge} </h1>
            <span>average age</span>
          </StatCard>
          <StatCard>
            <h1>{formatLabel(numHomeless)}</h1>
            <span>Homeless</span>
          </StatCard>
          <StatCard>
            <h1>{formatLabel(numVeterans)}</h1>
            <span>Veterans</span>
          </StatCard>
          <StatCard>
            <h1>{formatLabel(numMale)}</h1>
            <span>Male</span>
          </StatCard>
        </StatCardRow>

        <StatCardRow>
          <StatCard>
            <h1>{formatLabel(numUsingAlcohol)}</h1>
            <span>using only alcohol</span>
          </StatCard>
          <StatCard>
            <h1>{formatLabel(numUsingDrugs)}</h1>
            <span>using only drugs</span>
          </StatCard>
          <StatCard>
            <h1>{formatLabel(numUsingSubstance)}</h1>
            <span>Using both alcohol and drugs</span>
          </StatCard>
        </StatCardRow>

      </article>
    </SummaryStatsWrapper>
  );
};

export default SummaryStats;
