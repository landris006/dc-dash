import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import {
  Connection,
  GuildMember,
  Prisma,
  PrismaClient,
  User,
} from '@prisma/client';
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
          guildID_userID: { guildID: input.guildId, userID: input.userId },
        },
      });
    }),

  getWithUser: publicProcedure
    .input(
      z.object({
        guildID: z.string(),
        userID: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.guildMember.findUniqueOrThrow({
        where: {
          guildID_userID: { guildID: input.guildID, userID: input.userID },
        },
        include: {
          user: true,
        },
      });
    }),

  getConnectedMember: publicProcedure
    .input(
      z.object({
        guildID: z.string(),
        userID: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.guildMember.findUniqueOrThrow({
        where: {
          guildID_userID: { guildID: input.guildID, userID: input.userID },
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
        guildID: z.string(),
      })
    )
    .query(({ input: { guildID }, ctx }) => {
      return ctx.prisma.guildMember.findMany({
        where: {
          guildID,
        },
        include: {
          user: true,
        },
      });
    }),

  getAllInGuildWithLevel: publicProcedure
    .input(
      z.object({
        guildID: z.string(),
        level: z.number().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const members = await ctx.prisma.guildMember.findMany({
        where: {
          guildID: input.guildID,
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
        guildID: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, guildID, queryParams } = input;

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
                guildID,
                nickname: input.queryParams?.nickname ?? '',
                skip: (page - 1) * limit,
                take: limit + 1,
              })
            : await descendingHoursSpentQuery(ctx.prisma, {
                guildID,
                nickname: input.queryParams?.nickname ?? '',
                skip: (page - 1) * limit,
                take: limit + 1,
              });

        guildMembers = rawMembers.map((guildMember) => {
          const newGuildmember = {
            ...guildMember,
            id: guildMember.guildMemberID,
            user: {
              id: guildMember.userID,
              avatarURL: guildMember.avatarURL,
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
            guildID,
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
  avatarURL: string;
  username: string;
  guildMemberID: string;
  totalTime: number;
}

// pure joy
const ascendingHoursSpentQuery = async (
  prisma: PrismaClient,
  {
    guildID,
    nickname,
    skip,
    take,
  }: { guildID: string; nickname: string; skip: number; take: number }
) => {
  return prisma.$queryRaw<GuildMemberWithUser[]>`
  SELECT "GuildMember"."id" AS "guildMemberID",
    COALESCE(
      (
        SELECT SUM(EXTRACT(EPOCH FROM "endTime") - EXTRACT(EPOCH FROM "startTime")) * 1000
        FROM "Connection"
        WHERE "guildMemberID" = "GuildMember"."id"
      ), 0
    )
   AS "totalTime", *
  FROM "GuildMember"
  JOIN "User" ON "User"."id" = "GuildMember"."userID"

  WHERE "guildID" = ${guildID} AND
  "nickname" LIKE ${'%' + nickname + '%'}

  ORDER BY "totalTime" DESC

  OFFSET ${skip}
  LIMIT ${take}
  `;
};
const descendingHoursSpentQuery = async (
  prisma: PrismaClient,
  {
    guildID,
    nickname,
    skip,
    take,
  }: { guildID: string; nickname: string; skip: number; take: number }
) => {
  return prisma.$queryRaw<GuildMemberWithUser[]>`
  SELECT "GuildMember"."id" AS "guildMemberID",
    COALESCE(
      (
        SELECT SUM(EXTRACT(EPOCH FROM "endTime") - EXTRACT(EPOCH FROM "startTime")) * 1000
        FROM "Connection"
        WHERE "guildMemberID" = "GuildMember"."id"
      ), 0
    )
   AS "totalTime", *
  FROM "GuildMember"
  JOIN "User" ON "User"."id" = "GuildMember"."userID"

  WHERE "guildID" = ${guildID} AND
  "nickname" LIKE ${'%' + nickname + '%'}

  ORDER BY "totalTime" ASC

  OFFSET ${skip}
  LIMIT ${take}
  `;
};
