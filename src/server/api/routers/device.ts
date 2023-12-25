import { z } from "zod";
import { ironhiveRequest, ironhiveResponse } from "~/config/ironhive-command";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { natsConnection } from "~/server/nats";

export const deviceRouter = createTRPCRouter({
  test: protectedProcedure
    .input(z.object({ device: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const isValid = await natsConnection.send(
          input.device,
          ironhiveRequest.ping,
        );
        if (!isValid) {
          throw new Error("Validation failed!");
        }
      } catch {
        throw new Error("Connect fail!");
      }
    }),
  add: protectedProcedure
    .input(z.object({ device: z.string(), locationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { resp } = await natsConnection.send(
        input.device,
        ironhiveRequest.ping,
      );
      if (resp != ironhiveResponse.ping) {
        throw new Error("Validation failed!");
      }

      // The following part of the code should modified after Agents can be automatically generated
      const newAgent = await ctx.db.agent.create({
        data: {
          version: "1.0",
          lastSeen: new Date(),
          os: "Windows",
          secret: input.device,
          fileName: "file",
          autoUpdate: false,
        },
      });

      const { ip } = await natsConnection.send(
        input.device,
        ironhiveRequest.publicIp,
      );
      const newDevice = await ctx.db.device.create({
        data: {
          name: "Home",
          agentId: newAgent.id,
          type: "Desktop",
          os: "Windows",
          osFullName: "Windows 10",
          conection: "Online",
          remoteCode: {}, // replace with actual remote code
          health: {}, // replace with actual health
          internalIp: "192.168.1.1",
          publicIp: ip,
          locationId: input.locationId,
        },
      });
      return newDevice;
    }),
});
