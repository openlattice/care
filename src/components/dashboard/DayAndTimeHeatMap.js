import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { isImmutable, Map } from 'immutable';

const COLORS = [
  '#feffd9',
  '#edf8b1',
  '#c7e9b4',
  '#7fccbb',
  '#40b6c4',
  '#1e91c0',
  '#225ea8',
  '#253494',
  '#081d58'
];

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: #ffffff;
  border: 1px solid #e1e1eb;
  padding: 30px;
  margin-top: 20px;
`;

const Title = styled.div`
  font-weight: 600;
  color: #2e2e34;
  font-size: 20px;
  margin-bottom: 20px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Label = styled.div`
  width: 40px;
  height: 40px;
  font-size: 14px;
  font-weight: 400;
  margin: 2px;
  color: #2e2e34;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Cell = styled.div.attrs({
  style: ({ color }) => ({
    backgroundColor: color
  })
})`
  display: flex;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  margin: 2px;
`;

const LegendWrapper = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 50px;
`;

const LegendItem = styled.div`
  height: 100%;
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  span:last-child {
    color: #8e929b;
    font-size: 12px;
    font-weight: 400;
    margin-left: 5px;
  }
`;

const LegendColor = styled.div.attrs({
  style: ({ color }) => ({
    backgroundColor: color
  })
})`
  width: 100%;
  height: 20px;
`;

const DayAndTimeHeatMap = ({ counts }) => {

  let min = 0;
  let max = 0;

  counts.valueSeq().forEach((hourCounts) => {
    hourCounts.forEach((count) => {
      if (count > max) {
        max = count;
      }
    });
  });

  const chunkSize = ((max + 1) - min) / COLORS.length;

  const renderHeaderRow = () => {
    const labels = [];
    labels.push(<Label key={-1} />);
    for (let i = 0; i < 24; i++) {
      let formattedTime;

      if (i === 0) {
        formattedTime = `12a`;
      }
      else if (i < 12) {
        formattedTime = `${i}a`;
      }
      else if (i === 12) {
        formattedTime = '12p';
      }
      else {
        formattedTime = `${i - 12}p`;
      }
      labels.push(<Label key={i}>{formattedTime}</Label>);
    }

    return <Row>{labels}</Row>;
  }

  const renderRow = (key) => {
    const cells = [];
    cells.push(<Label key={key}>{key}</Label>);
    for (let i = 0; i < 24; i += 1) {
      const count = counts.getIn([key, `${i}`], 0);
      const groupOffset = Math.floor((max - count) / chunkSize);
      const index = Number.isNaN(groupOffset) ? 0 : COLORS.length - 1 - groupOffset;

      cells.push(<Cell key={`${key}|${i}`} color={COLORS[index]} />);
    }

    return <Row>{cells}</Row>;
  }

  const renderLegend = () => {
    return (
      <LegendWrapper>
        {COLORS.map((color, index) => (
          <LegendItem key={`legend|${index}`}>
            <LegendColor color={color} />
            <span>&ge; {Math.ceil(chunkSize * index)}</span>
          </LegendItem>
        ))}
      </LegendWrapper>
    )
  }

  return (
    <Wrapper>
      <Title>Reports by Day of Week and Time</Title>
      {renderHeaderRow()}
      {renderRow('Mon')}
      {renderRow('Tue')}
      {renderRow('Wed')}
      {renderRow('Thu')}
      {renderRow('Fri')}
      {renderRow('Sat')}
      {renderRow('Sun')}
      {renderLegend()}
    </Wrapper>
  );
}

export default DayAndTimeHeatMap;
