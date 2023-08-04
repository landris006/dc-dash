import { z } from 'zod';
import { getTotalTime } from '../../../utils/getTotalTime';
import { publicProcedure, router } from '../trpc';

export const guildRouter = router({
  get: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.guild.findUniqueOrThrow({
      where: {
        id: input,
      },
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.guild.findMany();
  }),

  getVoiceChannels: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.voiceChannel.findMany({
      where: {
        guildId: input,
      },
    });
  }),

  getStats: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const guild = await ctx.prisma.guild.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        guildMembers: {
          include: {
            messages: true,
            connections: true,
          },
        },
      },
    });

    const stats = guild.guildMembers.reduce(
      (stats, guildMember) => {
        stats.totalMessages += guildMember.messages.length;
        stats.totalConnections += guildMember.connections.length;
        stats.totalTimeConnected += getTotalTime(guildMember.connections);
        return stats;
      },
      {
        totalMessages: 0,
        totalConnections: 0,
        totalTimeConnected: 0,
      }
    );

    return {
      ...stats,
      createdAt: guild.createdAt,
      totalMembers: guild.guildMembers.length,
    };
  }),

  getHighlights: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const guild = await ctx.prisma.guild.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        guildMembers: {
          include: {
            messages: true,
            connections: true,
            user: true,
          },
        },
      },
    });

    return guild.guildMembers.reduce(
      (highlights, guildMember) => {
        const { nickname, messages, connections } = guildMember;

        const totalMessages = messages.length;
        if (totalMessages > highlights.mostMessages.count) {
          highlights.mostMessages = {
            count: totalMessages,
            nickname: nickname ?? guildMember.user.username,
          };
        }

        if (guildMember.joinedAt < highlights.oldestMember.date) {
          highlights.oldestMember = {
            date: guildMember.joinedAt,
            nickname: nickname ?? guildMember.user.username,
          };
        }

        const totalTimeConnected = getTotalTime(connections);

        if (totalTimeConnected > highlights.mostTimeConnected.miliseconds) {
          highlights.mostTimeConnected = {
            miliseconds: totalTimeConnected,
            nickname: nickname ?? guildMember.user.username,
          };
        }

        return highlights;
      },
      {
        mostMessages: {
          count: 0,
          nickname: '',
        },
        mostTimeConnected: {
          miliseconds: 0,
          nickname: '',
        },
        oldestMember: {
          date: new Date(),
          nickname: '',
        },
      }
    );
  }),
});
