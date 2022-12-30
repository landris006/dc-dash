// src/server/router/_app.ts
import { router } from "../trpc";
import { guildRouter } from "./guild";
import { guildMemberRouter } from "./guildMember";
import { userRouter } from "./user";

export const appRouter = router({
  guildMember: guildMemberRouter,
  guild: guildRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
