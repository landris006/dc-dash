import React, { useContext } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { AppRouterTypes } from '../../../utils/trpc';
import { DimensionsContext } from '../elements/ChartWrapper';
import { axisBottom, axisLeft } from 'd3';
import Axis from '../elements/Axis';
import Sessions from '../elements/Sessions';
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
  const dimensions = useContext(DimensionsContext);

  const xScale = scaleTime()
    .domain([minX, maxX])
    .range([0, dimensions.innerWidth]);

  const yScale = scaleLinear()
    .domain([minY, maxY])
    .range([dimensions.innerHeight, 0]);

  return (
    <>
      <Axis
        axis={axisBottom(xScale)}
        transform={`translate(0, ${dimensions.innerHeight})`}
        className="text-lg"
      />

      <Axis axis={axisLeft(yScale)} className="text-lg" />

      <Sessions xScale={xScale} yScale={yScale} connections={connections} />

      <Ruler xScale={xScale} />
    </>
  );
};

export default ActivityChart;
