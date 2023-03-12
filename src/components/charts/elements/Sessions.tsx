import { Connection } from '@prisma/client';
import { ScaleLinear, ScaleTime } from 'd3';
import React from 'react';
import { AppRouterTypes } from '../../../utils/trpc';
import Session from './Session';

interface Props {
  xScale: ScaleTime<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  connections: AppRouterTypes['chart']['activity']['output'];
}

const Sessions = ({ xScale, yScale, connections }: Props) => {
  const plottedConnections = new Map<number, Connection[]>();

  return (
    <g>
      {[...connections]
        .sort(
          (a, b) =>
            (b.endTime?.getTime() ?? Date.now()) -
            b.startTime.getTime() -
            ((a.endTime?.getTime() ?? Date.now()) - a.startTime.getTime())
        )
        .map((connection) => {
          const width =
            xScale(connection.endTime ?? new Date()) -
            xScale(connection.startTime);

          if (width < 5) return;

          const position = decidePosition(connection, plottedConnections);

          return <Session key={connection.id} connection={connection} position={position} xScale={xScale} yScale={yScale} />;
        })}
    </g>
  );
};

export default Sessions;

const decidePosition = (
  connection: Connection,
  plottedConnections: Map<number, Connection[]>,
  levelToCheck = 1
): number => {
  const connectionsAtLevel = plottedConnections.get(levelToCheck);

  if (!connectionsAtLevel) {
    plottedConnections.set(levelToCheck, [connection]);
    return levelToCheck;
  }

  const intersections = checkIntersections(connection, connectionsAtLevel);
  if (intersections === 0) {
    plottedConnections.set(levelToCheck, [...connectionsAtLevel, connection]);
    return levelToCheck;
  }

  return decidePosition(connection, plottedConnections, levelToCheck + 1);
};

const checkIntersections = (
  connection: Connection,
  connections: Connection[]
): number => {
  return connections.filter((c) => {
    if (connection.id === c.id) {
      return false;
    }

    if (!connection.endTime && !c.endTime) {
      return true;
    }

    if (
      connection.startTime <= c.startTime &&
      (connection?.endTime ?? new Date()) >= c.startTime
    ) {
      return true;
    }

    if (
      connection.startTime >= c.startTime &&
      connection.startTime <= (c.endTime ?? new Date())
    ) {
      return true;
    }

    return false;
  }).length;
};
