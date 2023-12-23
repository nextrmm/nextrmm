import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const locationRouter = createTRPCRouter({
  getAllByOrganization: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.location.findMany({
        where: {
          organizationId: input.organizationId,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const allLocations = await ctx.db.location.findMany();
    return allLocations;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        organizationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.location.create({
        data: {
          name: input.name,
          organization: {
            connect: {
              id: input.organizationId,
            },
          },
        },
      });
    }),
});
