import React, { useContext } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { AppRouterTypes } from '../../../utils/trpc';
import { ChartContext } from '../elements/ChartContext';
import { axisBottom, axisLeft } from 'd3';
import Axis from '../elements/Axis';
import Connections from '../elements/Connections';
import Ruler from '../elements/Ruler';

const day = 1000 * 60 * 60 * 24 * 1;
const minX = Date.now() - day;
const maxX = Date.now();

const minY = 0;
const maxY = 10;

const ActivityChart = ({
  connections,
}: {
  connections: AppRouterTypes['chart']['activity']['output'];
}) => {
  const { innerWidth, innerHeight } = useContext(ChartContext);

  const xScale = scaleTime().domain([minX, maxX]).range([0, innerWidth]);

  const yScale = scaleLinear().domain([minY, maxY]).range([innerHeight, 0]);

  return (
    <>
      <Axis
        axis={axisBottom(xScale)}
        transform={`translate(0, ${innerHeight})`}
        className="text-lg"
      />

      <Axis axis={axisLeft(yScale)} className="text-lg" />

      <line
        x1={xScale(new Date(maxX).setHours(0, 0, 0))}
        x2={xScale(new Date(maxX).setHours(0, 0, 0))}
        y2={innerHeight}
        stroke="rgba(0, 0, 0, 0.3)"
      />

      <Connections xScale={xScale} yScale={yScale} connections={connections} />

      <Ruler xScale={xScale} />
    </>
  );
};

export default ActivityChart;
