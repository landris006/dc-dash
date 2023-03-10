import React, { useContext, useMemo } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { AppRouterTypes } from '../../../utils/trpc';
import { DimensionsContext } from '../elements/ChartWrapper';
import { axisBottom, axisLeft } from 'd3';
import Axis from '../elements/Axis';
import Sessions from '../elements/Sessions';
import Ruler from '../elements/Ruler';

const ActivityChart = ({
  connections,
}: {
  connections: AppRouterTypes['chart']['activity']['output'];
}) => {
  const dimensions = useContext(DimensionsContext);

  const calculatedDomains = useMemo(() => {
    const day = 1000 * 60 * 60 * 24;
    const minX = connections[0]?.startTime ?? new Date(Date.now() - day);
    const maxX =  new Date();

    const minY = 0;
    const maxY = 10;
    return { x: [minX, maxX], y: [minY, maxY] };
  }, [connections]);

  const xScale = scaleTime()
    .domain(calculatedDomains.x)
    .range([0, dimensions.innerWidth]);

  const yScale = scaleLinear()
    .domain(calculatedDomains.y)
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
