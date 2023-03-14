import { Connection } from '@prisma/client';
import { CONVERSIONS } from './conversions';

export const getTotalTime = (connections: Connection[]): number => {
  return connections.reduce((total, connection) => {
    const { startTime, endTime } = connection;
    if (!endTime) {
      return total;
    }

    return total + (endTime.getTime() - startTime.getTime());
  }, 0);
};

export const getLevel = (connections: Connection[]): number => {
  return CONVERSIONS.HOURS_TO_LEVEL(
    getTotalTime(connections) * CONVERSIONS.MILISECONDS_TO_HOURS
  );
};
