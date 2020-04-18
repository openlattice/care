// @flow
import React, { PureComponent } from 'react';

import range from 'lodash/range';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import ChartTooltip from './ChartTooltip';
import LabelTick from './LabelTick';

type Props = {
  data :Object[];
};

class ProfileBarChart extends PureComponent <Props> {

  renderTooltip = ({ label, payload } :any) => {
    const data = payload[0];
    if (data && data.payload) {
      const { count } = data.payload;
      return (
        <ChartTooltip>
          <div>{label}</div>
          <div>{`count: ${count}`}</div>
        </ChartTooltip>
      );
    }

    return null;
  };

  render() {
    const { data } = this.props;
    const numberOfBars = data.length;
    const maxCount = Math.max(...data.map((datum) => datum.count || 0));
    const STEP = 10;
    const maxTick = Math.ceil(maxCount / STEP) * STEP;
    const ticks = range(0, maxTick + 1, STEP);

    return (
      <ResponsiveContainer height={36 * numberOfBars + 24} width="100%">
        <BarChart
            layout="vertical"
            data={data}>
          <YAxis
              allowDuplicatedCategories={false}
              tickLine={false}
              axisLine={false}
              width={80}
              dataKey="name"
              // minTickGap={5}
              tick={LabelTick}
              type="category" />
          <XAxis
              height={16}
              axisLine={false}
              tickLine={false}
              dataKey="count"
              type="number"
              ticks={ticks}
              tick={{ stroke: '#AFB2B9', fontWeight: 300, fontSize: '0.75rem' }}
              domain={[0, maxCount]} />
          <Tooltip content={this.renderTooltip} />
          <Bar
              isAnimationActive={false}
              barSize={20}
              maxBarSize={20}
              barCategoryGap={0}
              dataKey="count"
              fill="#6697F6" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default ProfileBarChart;
