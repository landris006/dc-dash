import { GuildMember } from '@prisma/client';
import { ScaleTime } from 'd3';
import React, { useContext, useEffect } from 'react';
import { confine } from '../../../utils/confine';
import { CONVERSIONS } from '../../../utils/conversions';
import { AppRouterTypes } from '../../../utils/trpc';
import ClickOutsideListener from '../../common/ClickOutsideListener';
import Modal from '../../common/Modal';
import Panel from '../../common/Panel';
import { ChartContext } from './ChartContext';
import Image from 'next/image';

const tooltipWidth = 170;
const tooltipHeight = 30;

const Selector = ({
  connections,
  xScale,
}: {
  connections: AppRouterTypes['chart']['activity']['output'];
  xScale: ScaleTime<number, number, never>;
}) => {
  const { innerHeight, setAllowInteractions } = useContext(ChartContext);

  const { positions, setPositions, isDragging } = useGetPositions(xScale);

  const onClose = () => {
    setPositions([undefined, undefined]);
    setAllowInteractions(true);
  };

  if (!positions[0] || !positions[1]) {
    return null;
  }

  const startDate = xScale.invert(positions[0]);
  const endDate = xScale.invert(positions[1]);

  return (
    <>
      <Modal
        isOpen={!!(positions[0] && positions[1] && !isDragging)}
        blurBackground={false}
        onClose={onClose}
      >
        <ClickOutsideListener onClickOutside={onClose}>
          <Panel className="w-[90vw] bg-white bg-opacity-100 text-xl md:w-fit">
            <h2 className="text-2xl font-semibold">Total time connected</h2>

            <hr className="my-1 h-[2px] rounded bg-black" />

            <div className="grid grid-cols-2 gap-1">
              <span>Start date: </span>
              <span>{startDate.toLocaleString()}</span>
              <span>End date: </span>
              <span>{endDate.toLocaleString()}</span>
            </div>

            <hr className="my-1 h-[2px] rounded bg-black" />

            <TotalTimeList
              startDate={startDate}
              endDate={endDate}
              connections={connections}
            />
          </Panel>
        </ClickOutsideListener>
      </Modal>

      <g>
        <rect
          fill="#a78bfa"
          x={positions[0]}
          width={positions[1] - positions[0]}
          y={0}
          height={innerHeight}
          opacity={0.8}
        ></rect>

        <DateTooltip x={positions[0]} xScale={xScale} />
        <DateTooltip x={positions[1]} xScale={xScale} isBottom />
      </g>
    </>
  );
};
export default Selector;

const useGetPositions = (xScale: ScaleTime<number, number, never>) => {
  const {
    svgRef,
    margin,
    innerWidth,
    allowInteractions,
    setAllowInteractions,
  } = useContext(ChartContext);

  const [isDragging, setIsDragging] = React.useState(false);
  const [positions, setPositions] = React.useState<[number?, number?]>([
    undefined,
    undefined,
  ]);

  useEffect(() => {
    const svg = svgRef?.current;
    const svgLeft = svg?.getBoundingClientRect().left ?? 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (!allowInteractions) {
        return;
      }

      setPositions([
        confine(e.clientX - svgLeft - margin.left, [0.1, innerWidth]),
        undefined,
      ]);
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      if (!isDragging) {
        return;
      }

      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      setAllowInteractions(false);

      setPositions((prev) => [
        prev[0],
        confine(e.clientX - svgLeft - margin.left, [0.1, innerWidth]),
      ]);
    };

    svg?.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    svg?.addEventListener('mousemove', handleMouseMove);
    return () => {
      svg?.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      svg?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    svgRef,
    xScale,
    margin.left,
    isDragging,
    innerWidth,
    setAllowInteractions,
    allowInteractions,
  ]);

  return {
    positions: [...positions].sort((a, b) => {
      if (!a || !b) {
        return 0;
      }

      return a - b;
    }),
    setPositions,
    isDragging,
  };
};

const DateTooltip = ({
  x,
  isBottom = false,
  xScale,
}: {
  x: number;
  isBottom?: boolean;
  xScale: ScaleTime<number, number, never>;
}) => {
  const { innerHeight } = useContext(ChartContext);

  return (
    <g
      transform={`translate(${-tooltipWidth / 2 + x}, ${
        isBottom ? innerHeight - tooltipHeight : 0
      })`}
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
        {xScale.invert(x).toLocaleString()}
      </text>
    </g>
  );
};

const TotalTimeList = ({
  startDate,
  endDate,
  connections,
}: {
  startDate: Date;
  endDate: Date;
  connections: AppRouterTypes['chart']['activity']['output'];
}) => {
  if (endDate.getTime() - startDate.getTime() < 1000 * 60) {
    return <p className="font-semibold">Please select a longer interval!</p>;
  }

  const filteredConnections = connections.filter((connection) => {
    if (
      connection.startTime > endDate ||
      (connection.endTime ?? new Date()) < startDate
    ) {
      return false;
    }

    return true;
  });

  if (filteredConnections.length === 0) {
    return (
      <p className="font-semibold">No connections in selected interval!</p>
    );
  }
  const members = filteredConnections.reduce((acc, connection) => {
    let member = acc.get(connection.guildMember.id);
    if (!member) {
      member = { ...connection.guildMember, aggregatedTime: 0 };
      acc.set(member.id, member);
    }

    const confinedStartTime = confine(connection.startTime.getTime(), [
      startDate.getTime(),
      endDate.getTime(),
    ]);
    const confinedEndTime = confine(
      connection.endTime?.getTime() ?? Date.now(),
      [startDate.getTime(), endDate.getTime()]
    );

    member.aggregatedTime += confinedEndTime - confinedStartTime;

    return acc;
  }, new Map<GuildMember['id'], AppRouterTypes['chart']['activity']['output'][0]['guildMember'] & { aggregatedTime: number }>());

  return (
    <div className="grid grid-cols-2 gap-1">
      {[...members.values()].map((member) => (
        <React.Fragment key={member.id}>
          <span className="flex items-center gap-3">
            <Image
              src={member.user.avatarURL ?? '/default-avatar.png'}
              alt="profile picture"
              width={25}
              height={25}
              className="rounded-full"
            />
            {member.nickname ?? member.user.username}
          </span>

          <span>
            {(member.aggregatedTime * CONVERSIONS.MILISECONDS_TO_HOURS).toFixed(
              2
            ) + ' h'}
          </span>
        </React.Fragment>
      ))}{' '}
    </div>
  );
};
