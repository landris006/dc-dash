import { getLevel } from '../../../../utils/getTotalTime';
import { Context } from '../../context';

export const activity = async (guildID: string, ctx: Context) => {
  const now = new Date();
  const startTime = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1);

  const connections = await ctx.prisma.connection.findMany({
    where: {
      voiceChannel: {
        guildID,
      },
      startTime: {
        gte: startTime,
      },
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
        user: connection.guildMember.user,
        level,
        nickname: connection.guildMember.nickname,
      },
    };
  });
};
