import { getLevel } from '../../../../utils/getTotalTime';
import { Context } from '../../context';

export const activity = async (
  { guildId, interval }: { guildId: string; interval: number },
  ctx: Context
) => {
  const now = new Date();
  const startTime = new Date(now.getTime() - 1000 * 60 * 60 * 24 * interval);

  const connections = await ctx.prisma.connection.findMany({
    where: {
      voiceChannel: {
        guildId,
      },
      OR: [
        {
          endTime: {
            gte: startTime,
          },
        },
        {
          endTime: null,
        },
      ],
    },
    include: {
      guildMember: {
        include: {
          user: true,
          connections: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  return connections.map((connection) => {
    const connections = connection.guildMember.connections;
    const level = getLevel(connections);

    return {
      ...connection,
      guildMember: {
        id: connection.guildMember.id,
        guildID: connection.guildMember.guildId,
        userID: connection.guildMember.userId,
        joinedAt: connection.guildMember.joinedAt,
        user: connection.guildMember.user,
        level,
        nickname: connection.guildMember.nickname,
      },
    };
  });
};
