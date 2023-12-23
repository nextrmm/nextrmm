export const i18n = {
  defaultLocale: "en",
  locales: ["en", "es-ES", "zh-CN"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
