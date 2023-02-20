import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import ChartWrapper from './elements/ChartWrapper';
import Bars from './elements/Bars';
import YScale from './elements/YScale';
import XScale from './elements/XScale';

const width = 960;
const height = 600;
const margin = { top: 20, right: 20, bottom: 75, left: 75 };

export const dimensions = {
  width,
  height,
  margin: { top: 20, right: 20, bottom: 75, left: 75 },
  innerWidth: width - margin.left - margin.right,
  innerHeight: height - margin.top - margin.bottom,
};

const BarChart = ({
  levels,
}: {
  levels: {
    level: string;
    frequency: number;
  }[];
}) => {
  const max =
    [...levels].sort((a, b) => b.frequency - a.frequency)[0]?.frequency ?? 0;

  const xScale = scaleBand()
    .domain(levels.map((level) => level.level))
    .range([0, dimensions.innerWidth])
    .padding(0.1)
    .round(true);

  const yScale = scaleLinear()
    .domain([0, max])
    .range([0, dimensions.innerHeight]);

  return (
    <ChartWrapper width={width} height={height} margin={margin}>
      <XScale xScale={xScale} />

      <YScale yScale={yScale} />

      <Bars data={levels} xScale={xScale} yScale={yScale} />
    </ChartWrapper>
  );
};

export default BarChart;
