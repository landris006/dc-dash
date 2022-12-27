// src/server/router/_app.ts
import { router } from "../trpc";
import { guildRouter } from "./guild";
import { guildMemberRouter } from "./guildMember";

export const appRouter = router({
  guildMember: guildMemberRouter,
  guild: guildRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
