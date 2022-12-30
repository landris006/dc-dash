import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const guildMemberRouter = router({
  get: publicProcedure
    .input(
      z.object({
        guildId: z.string(),
        userId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.guildMember.findUnique({
        where: {
          guildID_userID: { guildID: input.guildId, userID: input.userId },
        },
      });
    }),

  getAllInGuild: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.guildMember.findMany({
      where: {
        guildID: input,
      },
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.guildMember.findMany();
  }),
});
