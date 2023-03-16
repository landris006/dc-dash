import { ScaleLinear, ScaleTime } from 'd3';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CONVERSIONS } from '../../../utils/conversions';
import { AppRouterTypes } from '../../../utils/trpc';
import { ChartContext } from './ChartContext';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import ClickOutsideListener from '../../common/ClickOutsideListener';
import Modal from '../../common/Modal';
import Panel from '../../common/Panel';
import { formatMiliseconds } from '../../../utils/helpers/formatDate';

interface Props {
  connection: AppRouterTypes['chart']['activity']['output'][0];
  xScale: ScaleTime<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  position: number;
}

const tooltipWidth = 300;
const imagePadding = 3;

const Connection = ({ connection, xScale, yScale, position }: Props) => {
  const { setAllowInteractions, svgRef, margin } = useContext(ChartContext);
  const { tooltipState, rectRef } = useIsHovered();
  const height = (yScale(0) - yScale(1)) * 0.8;
  const tooltipHeight = height * 0.75;
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
    setAllowInteractions(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ClickOutsideListener onClickOutside={onClose}>
          <Panel className="w-[90vw] bg-white bg-opacity-100 text-xl md:w-fit">
            <h2 className="text-2xl font-semibold">Connection</h2>

            <hr className="my-1 h-[2px] rounded bg-black" />

            <div className="grid grid-cols-2">
              <p>Member: </p>
              <p className="flex items-center gap-3">
                <Image
                  src={
                    connection.guildMember.user.avatarURL ??
                    '/default-avatar.png'
                  }
                  alt="profile picture"
                  width={25}
                  height={25}
                  className="rounded-full"
                />
                {connection.guildMember.nickname ??
                  connection.guildMember.user.username}
              </p>

              <p>From:</p>
              <p>{connection.startTime.toLocaleString()}</p>

              <p>To:</p>
              <p>{connection.endTime?.toLocaleString() ?? '-'}</p>

              <p>Duration:</p>
              <p>
                {formatMiliseconds(
                  (connection.endTime?.getTime() ??
                    xScale.domain()[1]?.getTime() ??
                    Date.now()) - connection.startTime.getTime()
                )}
              </p>
            </div>
          </Panel>
        </ClickOutsideListener>
      </Modal>

      <rect
        ref={rectRef}
        className={`relative cursor-pointer ${
          tooltipState.isHovered ? 'opacity-80' : 'opacity-60'
        }`}
        x={xScale(
          new Date(
            Math.max(
              connection.startTime.getTime(),
              xScale.domain()[0]?.getTime() ?? 0
            )
          )
        )}
        width={
          xScale(connection.endTime ?? xScale.domain()[1] ?? new Date()) -
          xScale(
            new Date(
              Math.max(
                connection.startTime.getTime(),
                xScale.domain()[0]?.getTime() ?? 0
              )
            )
          )
        }
        height={height}
        y={yScale(position + 1)}
        transform={`translate(0, ${(yScale(0) - yScale(1)) / 0.8 / 2})`}
        fill={
          CONVERSIONS.LEVEL_TO_COLOR_MAP[
            connection.guildMember.level.toString() as keyof typeof CONVERSIONS.LEVEL_TO_COLOR_MAP
          ]
        }
        onMouseDown={(e) => {
          setAllowInteractions(false);
          setIsOpen(true);
          e.stopPropagation();
        }}
      ></rect>

      {tooltipState.isHovered &&
        createPortal(
          <foreignObject
            x={
              tooltipState.side === 'right'
                ? xScale(
                    connection.endTime ?? xScale.domain()[1] ?? new Date()
                  ) + margin.left
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
    </>
  );
};

export default Connection;

const useIsHovered = () => {
  const {
    containerRef,
    height,
    innerWidth,
    svgRef,
    margin,
    allowInteractions,
  } = useContext(ChartContext);

  const [tooltipState, setTooltipState] = React.useState({
    isHovered: false,
    side: 'left' as 'left' | 'right',
  });

  const rectRef = React.useRef<SVGRectElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (
        !containerRef?.current ||
        !rectRef.current ||
        !svgRef?.current ||
        !allowInteractions
      ) {
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
    [
      containerRef,
      height,
      innerWidth,
      margin,
      rectRef,
      svgRef,
      allowInteractions,
    ]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return { tooltipState, rectRef };
};
