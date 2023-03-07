import { ScaleBand, ScaleLinear } from 'd3';
import React, { useContext, useMemo, useState } from 'react';
import { CONVERSIONS } from '../../../utils/conversions';
import { DimensionsContext } from './ChartWrapper';
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
  const dimensions = useContext(DimensionsContext);
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
          <div className="rounded-md bg-violet-400 bg-opacity-80 p-3 text-xl backdrop-blur-md">
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
            x={
              (xScale(level) ?? 0) - (xScale.padding() * xScale.bandwidth()) / 2
            }
            y={dimensions.innerHeight - yScale(frequency)}
            width={
              xScale.bandwidth() + xScale.padding() * xScale.bandwidth() + 2
            }
            height={yScale(frequency) + dimensions.margin.bottom}
            fill="transparent"
          ></rect>

          <rect
            x={xScale(level)}
            y={dimensions.innerHeight - yScale(frequency)}
            width={xScale.bandwidth()}
            height={yScale(frequency)}
            fill={
              CONVERSIONS.LEVEL_TO_COLOR_MAP[
                level as keyof typeof CONVERSIONS.LEVEL_TO_COLOR_MAP
              ]
            }
          ></rect>
        </g>
      ))}
    </>
  );
};

export default Bars;
