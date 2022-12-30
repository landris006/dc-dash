import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  get: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: input,
      },
    });
  }),
});
