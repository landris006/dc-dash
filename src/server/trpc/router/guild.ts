import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const guildRouter = router({
  get: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.guild.findUnique({
      where: {
        id: input,
      },
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.guild.findMany();
  }),
});
