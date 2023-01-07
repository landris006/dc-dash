import { z } from "zod";
import { publicProcedure, router } from "../trpc";

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

  getStats: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const guild = await ctx.prisma.guild.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        guildMembers: true,
        voiceChannels: true,
      },
    });

    const { guildMembers, voiceChannels } = guild;

    const stats = guildMembers.reduce(
      (stats, member) => {
        stats.totalMessages += member.messagesSent;
        stats.totalTimeConnected += member.hoursActive;

        return stats;
      },
      {
        totalMembers: guildMembers.length,
        totalMessages: 0,
        totalConnections: 0,
        totalTimeConnected: 0,
      }
    );

    stats.totalConnections = voiceChannels.reduce(
      (total, channel) => (total += channel.connections),
      0
    );

    return { ...stats, createdAt: (await guild)?.createdAt };
  }),
});
