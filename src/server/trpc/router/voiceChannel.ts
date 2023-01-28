import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const voiceChannelRouter = router({
  get: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.voiceChannel.findUniqueOrThrow({
      where: {
        id: input,
      },
    });
  }),
});
