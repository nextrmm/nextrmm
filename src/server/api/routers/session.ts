import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  getByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.session.findMany({
        where: input,
        orderBy: { lastActivity: "desc" },
      });
    }),
  deleteBySessionToken: protectedProcedure
    .input(z.object({ sessionToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.session.delete({
        where: { sessionToken: input.sessionToken },
      });
    }),
});
