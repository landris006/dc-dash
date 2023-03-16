import { z } from 'zod';
import { activity } from '../handlers/chart/activity';
import { levels } from '../handlers/chart/levels';
import { publicProcedure, router } from '../trpc';

export const chartRouter = router({
  levels: publicProcedure
    .input(z.object({ guildID: z.string() }))
    .query(async ({ input: { guildID }, ctx }) => levels(guildID, ctx)),

  activity: publicProcedure
    .input(
      z.object({ guildID: z.string(), interval: z.number().min(1).max(7) })
    )
    .query(({ input, ctx }) => activity(input, ctx)),
});
