import React, { useContext } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { DimensionsContext } from './elements/ChartWrapper';
import Bars from './elements/Bars';
import YScale from './elements/YScale';
import XScale from './elements/XScale';

const BarChart = ({
  levels,
}: {
  levels: {
    level: string;
    frequency: number;
  }[];
}) => {
  const dimensions = useContext(DimensionsContext);

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
    <>
      <XScale xScale={xScale} />

      <YScale yScale={yScale} />

      <Bars data={levels} xScale={xScale} yScale={yScale} />
    </>
  );
};

export default BarChart;
