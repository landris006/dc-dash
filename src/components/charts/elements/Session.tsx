import { ScaleLinear, ScaleTime } from 'd3';
import React, { useCallback, useContext, useEffect } from 'react';
import { CONVERSIONS } from '../../../utils/conversions';
import { AppRouterTypes } from '../../../utils/trpc';
import { DimensionsContext } from './ChartWrapper';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface Props {
  connection: AppRouterTypes['chart']['activity']['output'][0];
  xScale: ScaleTime<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  position: number;
}

const tooltipWidth = 300;
const imagePadding = 3;

const Session = ({ connection, xScale, yScale, position }: Props) => {
  const { tooltipState, rectRef, svgRef, margin } = useIsHovered();
  const height = (yScale(0) - yScale(1)) * 0.8;
  const tooltipHeight = height * 0.75;

  return (
    <g>
      <rect
        ref={rectRef}
        className={`relative cursor-pointer ${
          tooltipState.isHovered ? 'opacity-80' : 'opacity-60'
        }`}
        x={xScale(connection.startTime)}
        width={
          xScale(connection.endTime ?? new Date()) -
          xScale(connection.startTime)
        }
        height={height}
        y={yScale(position + 1)}
        transform={`translate(0, ${(yScale(0) - yScale(1)) / 0.8 / 2})`}
        fill={
          CONVERSIONS.LEVEL_TO_COLOR_MAP[
            connection.guildMember.level.toString() as keyof typeof CONVERSIONS.LEVEL_TO_COLOR_MAP
          ]
        }
      ></rect>

      {tooltipState.isHovered &&
        createPortal(
          <foreignObject
            x={
              tooltipState.side === 'right'
                ? xScale(connection.endTime ?? new Date()) + margin.left
                : xScale(connection.startTime) - tooltipWidth + margin.left
            }
            y={yScale(position) - tooltipHeight / 2 + margin.top}
            height={tooltipHeight}
            width={tooltipWidth}
            className="pointer-events-none"
          >
            <div
              className={`flex h-full items-center ${
                tooltipState.side === 'left' && 'justify-end'
              }`}
            >
              {tooltipState.side === 'right' && (
                <div className="h-0 w-0 border-y-[25px] border-r-[25px] border-l-0 border-y-transparent border-t-transparent border-r-violet-400 border-b-transparent border-opacity-80"></div>
              )}

              <div className="flex h-full items-center gap-3 bg-violet-400 bg-opacity-80 px-3">
                <Image
                  src={
                    connection.guildMember.user.avatarURL ??
                    '/default-avatar.png'
                  }
                  alt="profile picture"
                  width={tooltipHeight - imagePadding}
                  height={tooltipHeight - imagePadding}
                  className="rounded-full"
                />

                <span className="text-xl">
                  {connection.guildMember.nickname ??
                    connection.guildMember.user.username}
                </span>
              </div>

              {tooltipState.side === 'left' && (
                <div
                  className="h-0 w-0 border-y-[25px] border-l-[25px] border-r-0
                             border-y-transparent border-t-transparent border-l-violet-400
                             border-b-transparent border-opacity-80"
                ></div>
              )}
            </div>
          </foreignObject>,
          svgRef?.current ?? document.body
        )}
    </g>
  );
};

export default Session;

const useIsHovered = () => {
  const [tooltipState, setTooltipState] = React.useState({
    isHovered: false,
    side: 'left' as 'left' | 'right',
  });
  const { containerRef, height, innerWidth, svgRef, margin } =
    useContext(DimensionsContext);
  const rectRef = React.useRef<SVGRectElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef?.current || !rectRef.current || !svgRef?.current) {
        setTooltipState({ isHovered: false, side: 'left' });
        return;
      }

      if (
        e.clientY < containerRef.current.offsetTop ||
        e.clientY > containerRef.current.offsetTop + height
      ) {
        setTooltipState({ isHovered: false, side: 'left' });
        return;
      }

      const { left, right } = rectRef.current.getBoundingClientRect();

      return setTooltipState({
        isHovered: e.clientX > left && e.clientX < right,
        side:
          left >
          (svgRef.current.getBoundingClientRect().left +
            margin.left +
            innerWidth) /
            2
            ? 'left'
            : 'right',
      });
    },
    [containerRef, height, innerWidth, margin, rectRef, svgRef]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return { tooltipState, rectRef, svgRef, margin };
};
