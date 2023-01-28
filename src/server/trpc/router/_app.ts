// src/server/router/_app.ts
import { router } from '../trpc';
import { guildRouter } from './guild';
import { guildMemberRouter } from './guildMember';
import { userRouter } from './user';
import { voiceChannelRouter } from './voiceChannel';

export const appRouter = router({
  guildMember: guildMemberRouter,
  guild: guildRouter,
  user: userRouter,
  voiceChannel: voiceChannelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
