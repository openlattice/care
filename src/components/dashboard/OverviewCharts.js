/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Map } from 'immutable';

import {
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import ChartWrapper from './charts/ChartWrapper';
import ChartTooltip from './charts/ChartTooltip';
import SimpleBarChart from './charts/SimpleBarChart';
import DayAndTimeHeatMap from './charts/DayAndTimeHeatMap';
import { DASHBOARD_COUNTS } from '../../shared/Consts';
import { DATE_STR, TIME_STR } from '../../utils/DateUtils';

const OverviewChartsWrapper = styled.div`
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

type Props = {
  dashboardCounts :Map
};

const OverviewCharts = ({ dashboardCounts } :Props) => {

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
    );
  };

  const getTimeAsNumber = (timeStr) => {
    const time = moment(timeStr, TIME_STR);
    if (!time.isValid()) {
      return 0;
    }
    const hr = Number.parseInt(time.format('HH'), 10);
    const min = Number.parseInt(time.format('mm'), 10);
    return (hr * 60) + min;
  };

  const getTimeFromNumber = (timeNum) => {
    let hr = `${Math.floor(timeNum / 60)}`;
    hr = hr.length < 2 ? `0${hr}` : hr;
    let min = `${timeNum % 60}`;
    min = min.length < 2 ? `0${min}` : min;
    return moment(`${hr}:${min}`, 'HH:mm').format(TIME_STR);
  };

  const getDateAsNumber = (dateStr) => {
    const date = moment(dateStr, DATE_STR);
    if (!date.isValid()) {
      return 0;
    }
    const start = moment().subtract(1, 'month').startOf('day');
    return date.diff(start, 'days');
  };

  const getDateFromNumber = (dateNum) => {
    const dateMoment = moment().subtract(1, 'month').add(dateNum, 'days');
    return dateMoment.format('MMM D');
  };

  const renderTimelineChart = (chartType) => {
    const {
      formatAsNumber,
      formatAsString,
      momentConversionKey,
      color,
      title,
      countKey,
      maxVal
    } = chartType;
    const countMap = dashboardCounts.get(countKey, Map());
    const data = countMap
      .keySeq()
      .sort((o1, o2) => (moment(o1, momentConversionKey).isBefore(moment(o2, momentConversionKey)) ? -1 : 1))
      .map(o => ({
        [title]: formatAsNumber(o),
        count: countMap.get(o)
      })).toJS();
    return (
      <FractionWidthContainer items={2}>
        <ChartWrapper
            title={`Reports by ${title}`}
            yLabel="# reports"
            xLabel={title}>
          <LineChart width={500} height={250} data={data}>
            <XAxis type="number" dataKey={title} tickFormatter={formatAsString} domain={[0, maxVal]} />
            <YAxis type="number" dataKey="count" />
            <Tooltip content={pointData => tooltip('reports', chartType, pointData)} />
            <Line type="monotone" dataKey="count" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartWrapper>
      </FractionWidthContainer>
    );
  };

  const timelineChartTypes = {
    date: {
      formatAsNumber: getDateAsNumber,
      formatAsString: getDateFromNumber,
      momentConversionKey: DATE_STR,
      color: '#6124e2',
      title: 'Date',
      countKey: DASHBOARD_COUNTS.REPORTS_BY_DATE,
      maxVal: 31
    },
    time: {
      formatAsNumber: getTimeAsNumber,
      formatAsString: getTimeFromNumber,
      momentConversionKey: TIME_STR,
      color: '#00be84',
      title: 'Time',
      countKey: DASHBOARD_COUNTS.REPORTS_BY_TIME,
      maxVal: 60 * 24
    }
  };

  const renderBarChart = (title, color, countKey, isNumeric, isVertical) => (
    <SimpleBarChart
        vertical={isVertical}
        isNumeric={isNumeric}
        dashboardCounts={dashboardCounts}
        title={title}
        color={color}
        countKey={countKey}
        numItems={3} />
  );

  return (
    <OverviewChartsWrapper>
      <RowHeader>Incident timeline</RowHeader>
      <ChartRow>
        {renderTimelineChart(timelineChartTypes.date)}
        {renderTimelineChart(timelineChartTypes.time)}
      </ChartRow>
      <ChartRow>
        <DayAndTimeHeatMap counts={dashboardCounts.get(DASHBOARD_COUNTS.REPORTS_BY_DAY_OF_WEEK, Map())} />
      </ChartRow>
      <RowHeader>Consumer demographics</RowHeader>
      <ChartRow>
        {renderBarChart('Age', '#ffc59e', DASHBOARD_COUNTS.AGE, true)}
        {renderBarChart('Race', '#f89090', DASHBOARD_COUNTS.RACE)}
        {renderBarChart('Gender', '#7dd2ff', DASHBOARD_COUNTS.GENDER)}
      </ChartRow>
    </OverviewChartsWrapper>
  );
};

export default OverviewCharts;
