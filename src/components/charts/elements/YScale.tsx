import { ScaleLinear } from 'd3';
import { useContext } from 'react';
import { ChartContext } from './ChartContext';

const YScale = ({ yScale }: { yScale: ScaleLinear<number, number, never> }) => {
  const dimensions = useContext(ChartContext);

  return (
    <>
      <line
        x1={0}
        x2={0}
        y2={dimensions.innerHeight + 2}
        stroke="black"
        strokeWidth={2}
      ></line>

      <text
        className="text-xl"
        style={{ textAnchor: 'middle' }}
        transform={`translate(-60, ${dimensions.innerHeight / 2}), rotate(-90)`}
        dy=".32em"
      >
        Frequency
      </text>

      {yScale.ticks().map((tick) => (
        <g
          key={tick}
          transform={`translate(0, ${
            dimensions.innerHeight - yScale(tick) + 1
          })`}
        >
          {tick !== 0 && (
            <line x2={dimensions.innerWidth} stroke="rgba(0, 0, 0, 0.1)" />
          )}

          <line x1={-12} x2={0} stroke="black" />

          <text style={{ textAnchor: 'middle' }} dx={-27} dy=".32em">
            {tick}
          </text>
        </g>
      ))}
    </>
  );
};

export default YScale;
