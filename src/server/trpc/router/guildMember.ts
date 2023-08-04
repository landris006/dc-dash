import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { Connection, GuildMember, Prisma, PrismaClient, User } from '@prisma/client';
import { getLevel, getTotalTime } from '../../../utils/getTotalTime';

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
          guildId_userId: { guildId: input.guildId, userId: input.userId },
        },
      });
    }),

  getWithUser: publicProcedure
    .input(
      z.object({
        guildId: z.string(),
        userId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.guildMember.findUniqueOrThrow({
        where: {
          guildId_userId: { guildId: input.guildId, userId: input.userId },
        },
        include: {
          user: true,
        },
      });
    }),

  getConnectedMember: publicProcedure
    .input(
      z.object({
        guildId: z.string(),
        userId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.guildMember.findUniqueOrThrow({
        where: {
          guildId_userId: { guildId: input.guildId, userId: input.userId },
        },
        include: {
          user: true,
          connections: {
            where: {
              endTime: null,
            },
          },
        },
      });
    }),

  getMemberInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const guildMember = await ctx.prisma.guildMember.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          user: true,
          messages: true,
          connections: true,
        },
      });

      const guildMemberForReturn = {
        ...guildMember,
        messages: undefined,
        connections: undefined,
        timeActive: getTotalTime(guildMember.connections),
        totalMessages: guildMember.messages.length,
      };
      delete guildMemberForReturn.messages;
      delete guildMemberForReturn.connections;

      return guildMemberForReturn;
    }),

  getAllInGuild: publicProcedure
    .input(
      z.object({
        guildId: z.string(),
      })
    )
    .query(({ input: { guildId }, ctx }) => {
      return ctx.prisma.guildMember.findMany({
        where: {
          guildId,
        },
        include: {
          user: true,
        },
      });
    }),

  getAllInGuildWithLevel: publicProcedure
    .input(
      z.object({
        guildId: z.string(),
        level: z.number().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const members = await ctx.prisma.guildMember.findMany({
        where: {
          guildId: input.guildId,
        },
        include: {
          user: true,
          connections: true,
        },
      });

      return members.filter((member) => {
        const level = getLevel(member.connections);
        return level === input.level;
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
        guildId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, guildId, queryParams } = input;

      const isSortingByHoursActive = queryParams?.orderBy?.hoursActive;
      const orderBy =
        queryParams?.orderBy as Prisma.Enumerable<Prisma.GuildMemberOrderByWithRelationInput>;

      let guildMembers: (GuildMember & {
        user: User;
        totalTime: number;
      })[];

      if (isSortingByHoursActive) {
        const rawMembers =
          isSortingByHoursActive === 'asc'
            ? await ascendingHoursSpentQuery(ctx.prisma, {
                guildId,
                nickname: input.queryParams?.nickname ?? '',
                skip: (page - 1) * limit,
                take: limit + 1,
              })
            : await descendingHoursSpentQuery(ctx.prisma, {
                guildId,
                nickname: input.queryParams?.nickname ?? '',
                skip: (page - 1) * limit,
                take: limit + 1,
              });

        guildMembers = rawMembers.map((guildMember) => {
          const newGuildmember = {
            ...guildMember,
            id: guildMember.guildMemberId,
            user: {
              id: guildMember.userId,
              avatarUrl: guildMember.avatarUrl,
              username: guildMember.username,
            },
          };

          return newGuildmember;
        });
      } else {
        const guildMembersRes = await ctx.prisma.guildMember.findMany({
          skip: (page - 1) * limit,
          take: limit + 1,
          where: {
            guildId,
            nickname: {
              contains: input.queryParams?.nickname,
            },
          },
          include: {
            user: true,
            connections: {
              where: {
                NOT: [{ endTime: null }],
              },
            },
          },
          orderBy,
        });

        guildMembers = guildMembersRes.map((guildMember) => {
          const newGuildmember = {
            ...guildMember,
            connections: guildMember.connections as Connection[] | undefined,
            totalTime: getTotalTime(guildMember.connections),
          };

          delete newGuildmember.connections;

          return newGuildmember;
        });
      }

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

interface GuildMemberWithUser extends GuildMember {
  avatarUrl: string;
  username: string;
  guildMemberId: string;
  totalTime: number;
}

// pure joy
const ascendingHoursSpentQuery = async (
  prisma: PrismaClient,
  {
    guildId,
    nickname,
    skip,
    take,
  }: { guildId: string; nickname: string; skip: number; take: number }
) => {
  const result = await prisma.$queryRaw`
  SELECT "guild_member"."id" AS "guild_member_id",
    COALESCE(
      (
        SELECT SUM(EXTRACT(EPOCH FROM "end_time") - EXTRACT(EPOCH FROM "start_time")) * 1000
        FROM "connection"
        WHERE "guild_member_id" = "guild_member"."id"
      ), 0
    )
   AS "total_time", *
  FROM "guild_member"
  JOIN "user" ON "user"."id" = "guild_member"."user_id"

  WHERE "guild_id" = ${guildId} AND
  "nickname" LIKE ${'%' + nickname + '%'}

  ORDER BY "total_time" DESC

  OFFSET ${skip}
  LIMIT ${take}
  `;

  // @ts-ignore
  return result.map((guildMember) => ({
    ...guildMember,
    guildMemberId: guildMember.guild_member_id,
    avatarUrl: guildMember.avatar_url,
    guildId: guildMember.guild_id,
    joinedAt: guildMember.joined_at,
    userId: guildMember.user_id,
    totalTime: guildMember.total_time,
  }));
};

const descendingHoursSpentQuery = async (
  prisma: PrismaClient,
  {
    guildId,
    nickname,
    skip,
    take,
  }: { guildId: string; nickname: string; skip: number; take: number }
) => {
  const result = await prisma.$queryRaw`
  SELECT "guild_member"."id" AS "guild_member_id",
    COALESCE(
      (
        SELECT SUM(EXTRACT(EPOCH FROM "end_time") - EXTRACT(EPOCH FROM "start_time")) * 1000
        FROM "connection"
        WHERE "guild_member_id" = "guild_member"."id"
      ), 0
    )
   AS "total_time", *
  FROM "guild_member"
  JOIN "user" ON "user"."id" = "guild_member"."user_id"

  WHERE "guild_id" = ${guildId} AND
  "nickname" LIKE ${'%' + nickname + '%'}

  ORDER BY "total_time" ASC

  OFFSET ${skip}
  LIMIT ${take}
  `;

  // @ts-ignore
  return result.map((guildMember) => ({
    ...guildMember,
    guildMemberId: guildMember.guild_member_id,
    avatarUrl: guildMember.avatar_url,
    guildId: guildMember.guild_id,
    joinedAt: guildMember.joined_at,
    userId: guildMember.user_id,
    totalTime: guildMember.total_time,
  }));
};
