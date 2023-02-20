import { Connection } from '@prisma/client';

export const getTotalTime = (connections: Connection[]) => {
  return connections.reduce((total, connection) => {
    const { startTime, endTime } = connection;
    if (!endTime) {
      return total;
    }

    return total + (endTime.getTime() - startTime.getTime());
  }, 0);
};
