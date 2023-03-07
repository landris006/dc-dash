import { ScaleTime } from 'd3';
import React, { useContext, useEffect, useState } from 'react';
import { DimensionsContext } from './ChartWrapper';

const width = 3;
const tooltipWidth = 150;
const tooltipHeight = 30;

const Ruler = ({ xScale }: { xScale: ScaleTime<number, number, never> }) => {
  const { position, innerHeight, tooltipText, isShowing, tooltipOffset } =
    useGetRulerData(xScale);

  return (
    <>
      {isShowing && (
        <g
          className="pointer-events-none"
          transform={`translate(${position - width / 2}, 0)`}
        >
          <rect
            fill="#a78bfa"
            x={0}
            y={tooltipHeight}
            height={innerHeight - tooltipHeight}
            width={width}
          ></rect>

          <g
            transform={`translate(${
              -(tooltipWidth + width) / 2 + tooltipOffset
            }, 0)`}
          >
            <rect
              fill="#a78bfa"
              opacity={0.8}
              x={0}
              y={0}
              width={tooltipWidth}
              height={tooltipHeight}
              rx={10}
            ></rect>

            <text textAnchor="middle" x={tooltipWidth / 2} dy="1.4em">
              {tooltipText}
            </text>
          </g>
        </g>
      )}
    </>
  );
};

export default Ruler;

const useGetRulerData = (xScale: ScaleTime<number, number, never>) => {
  const { height, innerHeight, innerWidth, containerRef, margin } =
    useContext(DimensionsContext);

  const [position, setPosition] = useState(0);
  const [tooltipText, setTooltipText] = useState('');
  const [isShowing, setIsShowing] = useState(false);
  const [tooltipOffset, setTooltipOffset] = useState(width / 2);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef?.current) {
        return;
      }

      if (
        e.clientY < containerRef.current.offsetTop ||
        e.clientY > containerRef.current.offsetTop + height
      ) {
        setIsShowing(false);
        return;
      }

      let offsetX = e.clientX - containerRef.current.offsetLeft - margin.left;

      if (offsetX < 0) {
        offsetX = 0;
        setIsShowing(false);
        return;
      }
      if (offsetX > innerWidth) {
        offsetX = innerWidth;
        setIsShowing(false);
        return;
      }

      setTooltipOffset(width / 2);
      if (offsetX < tooltipWidth / 2) {
        setTooltipOffset((tooltipWidth + width) / 2 - offsetX);
      }
      if (offsetX > innerWidth - tooltipWidth / 2) {
        setTooltipOffset(innerWidth - offsetX - (tooltipWidth + width) / 2);
      }

      setIsShowing(true);

      const date = xScale.invert(offsetX);
      const hours = date.getHours();
      const minutes = date.getMinutes();

      setTooltipText(
        `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}\n${
          hours < 10 ? '0' : ''
        }${hours}:${minutes < 10 ? '0' : ''}${minutes}`
      );
      setPosition(offsetX);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [height, containerRef, margin.left, innerWidth, xScale]);

  return {
    position,
    innerHeight,
    tooltipText,
    isShowing,
    tooltipOffset,
  };
};
