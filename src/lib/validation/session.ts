import { z } from "zod";

export const ZDeviceInfoSchema = z.object({
  ip: z.string(),
  country: z.string(),
  deviceType: z.string(),
  city: z.string(),
  os: z.string(),
  browser: z.string(),
});

export type TDeviceInfoSchema = z.infer<typeof ZDeviceInfoSchema>;

export const ZDeviceInfoSchemad = z.object({
  ip: z.string(),
  deviceInfo: ZDeviceInfoSchema,
});

export const ZSession = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  lastActivity: z.date(),
  expires: z.date(),
  sessionToken: z.string(),
  userId: z.string(),
  deviceInfo: ZDeviceInfoSchema.nullable(),
});

export type TSession = z.infer<typeof ZSession>;
