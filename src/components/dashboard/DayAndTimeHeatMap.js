import React from 'react';

import HeatMap from './HeatMap';

const DayAndTimeHeatMap = ({ counts }) => {

  const colValues = [];
  for (let i = 0; i < 24; i++) {
    colValues.push(i);
  }

  const colHeaderFormatter = (value) => {
    let formattedTime;

    if (value === 0) {
      formattedTime = `12a`;
    }
    else if (value < 12) {
      formattedTime = `${value}a`;
    }
    else if (value === 12) {
      formattedTime = '12p';
    }
    else {
      formattedTime = `${value - 12}p`;
    }
    return formattedTime;
  }


  return (
    <HeatMap
        title="Reports by Day of Week and Time"
        rowHeaders={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        colValues={colValues}
        colHeaderFormatter={colHeaderFormatter}
        cellSize={40}
        counts={counts}
        square />
  );
}

export default DayAndTimeHeatMap;
