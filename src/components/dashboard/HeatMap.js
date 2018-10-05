/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { Map } from 'immutable';

import { HEATMAP_COLORS } from '../../utils/Colors';

type Props = {
  title :string,
  colValues :string[],
  colHeaderFormatter? :(colValue :Object) => string,
  rowHeaders :string[],
  rowHeaderFormatter? :(colValue :Object) => string,
  cellSize :number,
  counts :Map,
  withContent? :boolean,
  square? :boolean
}

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

const BaseCell = styled.div`
  display: flex;
  border-radius: 5px;
  width: ${props => (props.square ? `${props.size}px` : '100%')};
  height: ${props => props.size}px;
  margin: 2px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Label = styled(BaseCell)`
  font-size: 14px;
  font-weight: 400;
  color: #2e2e34;
`;

const Cell = styled(BaseCell).attrs({
  style: ({ color }) => ({
    backgroundColor: color
  })
})``;

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

const HeatMap = ({
  title,
  colValues,
  colHeaderFormatter,
  rowHeaders,
  rowHeaderFormatter,
  cellSize,
  counts,
  withContent,
  square
} :Props) => {

  const min = 0;
  let max = 0;

  counts.valueSeq().forEach((subCounts) => {
    subCounts.forEach((count) => {
      if (count > max) {
        max = count;
      }
    });
  });

  const chunkSize = ((max + 1) - min) / HEATMAP_COLORS.length;

  const renderHeaderRow = () => {
    const labels = [];
    labels.push(<Label square={square} size={cellSize} key={-1} />);
    colValues.forEach((colValue) => {
      labels.push(<Label square={square} size={cellSize} key={colValue}>{colHeaderFormatter(colValue)}</Label>);
    });

    return <Row>{labels}</Row>;
  };

  const renderRow = (rowHeader) => {
    const cells = [];
    cells.push(<Label square={square} size={cellSize} key={rowHeader}>{rowHeaderFormatter(rowHeader)}</Label>);
    colValues.forEach((colValue) => {
      const count = counts.getIn([rowHeader, `${colValue}`], 0);
      const groupOffset = Math.floor((max - count) / chunkSize);
      const index = Number.isNaN(groupOffset) ? 0 : HEATMAP_COLORS.length - 1 - groupOffset;

      cells.push(
        <Cell square={square} size={cellSize} key={`${rowHeader}|${colValue}`} color={HEATMAP_COLORS[index]}>
          {withContent ? count : null}
        </Cell>
      );
    });

    return <Row key={`row-${rowHeader}`}>{cells}</Row>;
  };

  const renderLegend = () => {
    return (
      <LegendWrapper>
        {HEATMAP_COLORS.map((color, index) => (
          <LegendItem key={`legend|${index}`}>
            <LegendColor color={color} />
            <span>&ge; {Math.ceil(chunkSize * index)}</span>
          </LegendItem>
        ))}
      </LegendWrapper>
    );
  };

  return (
    <Wrapper>
      <Title>{title}</Title>
      {renderHeaderRow()}
      {rowHeaders.map(rowHeader => renderRow(rowHeader))}
      {renderLegend()}
    </Wrapper>
  );
};

HeatMap.defaultProps = {
  withContent: false,
  colHeaderFormatter: col => col,
  rowHeaderFormatter: row => row,
  square: false
}

export default HeatMap;
