import { connect, StringCodec } from "nats";
import { env } from "~/env.mjs";

export const natsConnection = await natsFactory();

async function natsFactory() {
  let nc = await connect({ servers: env.NATS_SERVER });
  return {
    async send(device: string, command: string) {
      if (!nc) {
        throw new Error("nc is not initialized. Call setConnect first.");
      }
      const sc = StringCodec();
      const m = await nc.request(device, command, { timeout: 1000 });
      return JSON.parse(sc.decode(m.data));
    },
  };
}
