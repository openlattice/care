/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Map, Set } from 'immutable';

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import ChartWrapper from './ChartWrapper';
import ChartTooltip from './ChartTooltip';
import HeatMap from './HeatMap';
import { DASHBOARD_COUNTS } from '../../shared/Consts';
import { DATE_STR, TIME_STR } from '../../utils/DateUtils';

const OutcomeChartsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px 0;
`;

const ChartRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FractionWidthContainer = styled.div`
  width: ${props => ((100 / props.items) - 1)}%;
`;

const TooltipRow = styled.div`
  margin: 5px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const RowHeader = styled.div`
  width: 100%;
  margin: 20px 0 10px 0;
  font-size: 20px;
  color: #2e2e34;
  font-weight: 600;
`;

const OutcomeCharts = ({ dashboardCounts }) => {

  const tooltip = (counted, { title, formatAsString }, { label, payload }) => {
    return (
      <ChartTooltip>
        <TooltipRow>
          <div>{`${title}: ${formatAsString(label)}`}</div>
        </TooltipRow>
        {(payload && payload.length) ? payload.map(point => (
          <TooltipRow key={point.name}>
            <div>{`Number of ${counted}: ${point.value}`}</div>
          </TooltipRow>
        )) : null}
      </ChartTooltip>
    )
  }

  const renderBarChart = (title, color, countKey, isNumeric) => {
    const countMap = dashboardCounts.get(countKey, Map());
    const data = countMap
      .keySeq()
      .sort((o1, o2) => {
        const v1 = isNumeric ? o1 : countMap.get(o1);
        const v2 = isNumeric ? o2 : countMap.get(o2);
        return v1 > v2 ? -1 : 1;
      })
      .map(o => ({
        [title]: o,
        count: countMap.get(o)
      })).toJS();
    return (
      <FractionWidthContainer items={3}>
        <ChartWrapper title={title} yLabel={'# consumers'}>
          <BarChart width={360} height={250} data={data}>
            <XAxis type={isNumeric ? 'number' : 'category'} dataKey={title} />
            <YAxis type="number" dataKey="count" />
            <Tooltip content={data => tooltip('consumers', { title, formatAsString: i => i }, data)} />
            <Bar dataKey="count" fill={color} />
          </BarChart>
        </ChartWrapper>
      </FractionWidthContainer>
    )
  }

  const renderDeescalationDispositionHeatmap = () => {
    const countMap = dashboardCounts.get(DASHBOARD_COUNTS.DISPOSITIONS_BY_DEESCALATION, Map());
    const deescList = countMap.keySeq();
    const dispList = deescList.size ? countMap.valueSeq().first().keySeq() : List();
    return (
      <HeatMap
          title="Dispositions by de-escalation techniques"
          rowHeaders={deescList}
          colValues={dispList}
          cellSize={50}
          counts={countMap}
          withContent />
    );
  }

  return (
    <OutcomeChartsWrapper>
      <RowHeader>Dispositions</RowHeader>
      <ChartRow>
        {renderBarChart('Disposition', '#ffc59e', DASHBOARD_COUNTS.DISPOSITIONS)}
        {renderBarChart('De-escalation techniques', '#f89090', DASHBOARD_COUNTS.DEESCALATION)}
        {renderBarChart('Specialized resources', '#7dd2ff', DASHBOARD_COUNTS.RESOURCES)}
      </ChartRow>
      <ChartRow>
        {renderDeescalationDispositionHeatmap()}
      </ChartRow>
    </OutcomeChartsWrapper>
  );
}

export default OutcomeCharts;
