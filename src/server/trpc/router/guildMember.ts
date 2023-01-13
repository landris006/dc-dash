import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { GuildMember, Prisma } from "@prisma/client";

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

  getAllInGuildWithUser: publicProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.prisma.guildMember.findMany({
        where: {
          guildID: input,
        },
        include: {
          user: true,
        },
      });
    }),

  getMembers: publicProcedure
    .input(
      z.object({
        skip: z.number().min(0).or(z.undefined()),
        take: z.number().min(1).or(z.undefined()),
        guildID: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      const { take, skip, guildID } = input;

      return ctx.prisma.guildMember.findMany({
        skip,
        take,
        where: {
          guildID,
        },
        include: {
          user: true,
        },
        orderBy: {
          nickname: "asc",
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.guildMember.findMany();
  }),
});
