import { ScaleBand, ScaleLinear } from 'd3';
import React, { useMemo, useState } from 'react';
import { CONVERSIONS } from '../../../utils/conversions';
import { dimensions } from '../BarChart';
import Tooltip from './Tooltip';

const Bars = ({
  data,
  xScale,
  yScale,
}: {
  data: { level: string; frequency: number }[];
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number, never>;
}) => {
  const [tooltipData, setTooltipData] = useState<{
    level: string;
    frequency: number;
  }>();

  const frequencySum = useMemo(
    () => data.reduce((acc, curr) => acc + curr.frequency, 0),
    [data]
  );

  return (
    <>
      <Tooltip>
        {tooltipData && (
          <div className="text-xl backdrop-blur-md">
            <p>Level: {tooltipData.level}</p>
            <p>Frequency: {tooltipData.frequency}</p>
            <p>
              Ratio: {Math.round((tooltipData.frequency / frequencySum) * 100)}{' '}
              %
            </p>
          </div>
        )}
      </Tooltip>

      {data.map(({ level, frequency }) => (
        <g
          key={level}
          onMouseEnter={() =>
            setTooltipData({
              level,
              frequency,
            })
          }
          onMouseLeave={() => setTooltipData(undefined)}
          className="cursor-pointer opacity-60 hover:opacity-80"
        >
          <rect
            key={level}
            x={xScale(level)}
            y={dimensions.innerHeight}
            width={
              xScale.bandwidth() + xScale.padding() * xScale.bandwidth() + 1
            }
            height={dimensions.margin.bottom}
            fill="transparent"
          ></rect>

          <rect
            x={xScale(level)}
            y={dimensions.innerHeight - yScale(frequency)}
            width={xScale.bandwidth()}
            height={yScale(frequency)}
            fill={CONVERSIONS.LEVEL_TO_COLOR_MAP.get(+level)}
          ></rect>
        </g>
      ))}
    </>
  );
};

export default Bars;
