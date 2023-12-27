import bcrypt from "bcrypt";
import { z } from "zod";
import { signupDataSchema } from "~/lib/validation/auth";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  addUser: publicProcedure
    .input(signupDataSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return "Username already exists";
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await ctx.db.user.create({
        data: {
          email,
          hashedPassword,
          emailVerified: new Date(),
        },
      });
      return "Ok";
    }),
});
