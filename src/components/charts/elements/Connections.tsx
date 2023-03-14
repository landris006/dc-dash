import { ScaleLinear, ScaleTime } from 'd3';
import React from 'react';
import { AppRouterTypes } from '../../../utils/trpc';
import ConnectionComponent from './Connection';
import type { Connection } from '@prisma/client';

interface Props {
  xScale: ScaleTime<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  connections: AppRouterTypes['chart']['activity']['output'];
}

const Connections = ({ xScale, yScale, connections }: Props) => {
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

          return (
            <ConnectionComponent
              key={connection.id}
              connection={connection}
              position={position}
              xScale={xScale}
              yScale={yScale}
            />
          );
        })}
    </g>
  );
};

export default Connections;

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

    if (
      connection.startTime > (c.endTime ?? new Date()) ||
      (connection.endTime ?? new Date()) < c.startTime
    ) {
      return false;
    }

    return true;
  }).length;
};
