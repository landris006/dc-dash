import { ScaleBand } from 'd3';
import { dimensions } from '../BarChart';

const XScale = ({ xScale }: { xScale: ScaleBand<string> }) => {
  return (
    <>
      <line
        x2={dimensions.innerWidth}
        y1={dimensions.innerHeight + 1}
        y2={dimensions.innerHeight + 1}
        strokeWidth={2}
        stroke="black"
      ></line>

      <text
        className="text-xl"
        style={{ textAnchor: 'middle' }}
        transform={`translate(${dimensions.innerWidth / 2}, ${
          dimensions.innerHeight + 40
        })`}
        dy=".32em"
      >
        Levels
      </text>

      {xScale.domain().map((tick) => (
        <g
          key={tick}
          transform={`translate(${
            (xScale(tick) ?? 0) + xScale.bandwidth() / 2
          }, 0)`}
        >
          <line
            y1={dimensions.innerHeight}
            y2={dimensions.innerHeight + 12}
            stroke="black"
          ></line>

          <text
            style={{ textAnchor: 'middle' }}
            dy=".71em"
            y={dimensions.innerHeight + 12}
          >
            Level {tick}
          </text>
        </g>
      ))}
    </>
  );
};

export default XScale;
