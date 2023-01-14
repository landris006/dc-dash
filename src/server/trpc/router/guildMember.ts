import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

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

  getPaginatedMembers: publicProcedure
    .input(
      z.object({
        page: z.number().min(1),
        limit: z.number().min(10),
        queryParams: z
          .object({
            nickname: z.string().or(z.undefined()),
            orderBy: z
              .object({
                nickname: z.enum(['asc', 'desc']).or(z.undefined()),
                hoursActive: z.enum(['asc', 'desc']).or(z.undefined()),
                joinedAt: z.enum(['asc', 'desc']).or(z.undefined()),
              })
              .nullish(),
          })
          .nullish(),
        guildID: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, guildID } = input;

      const orderBy = input.queryParams
        ?.orderBy as Prisma.Enumerable<Prisma.GuildMemberOrderByWithRelationInput>;

      const guildMembers = await ctx.prisma.guildMember.findMany({
        skip: (page - 1) * limit,
        take: limit + 1,
        where: {
          guildID,
          nickname: {
            contains: input.queryParams?.nickname,
          },
        },
        include: {
          user: true,
        },
        orderBy,
      });

      let hasMore = false;
      if (guildMembers.length > limit) {
        guildMembers.pop();
        hasMore = true;
      }

      return {
        guildMembers,
        hasMore,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.guildMember.findMany();
  }),
});
