import type { Locale } from "~/i18n-config";
import { getDictionary } from "~/lib/dictionary";

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

export default async function GeneralSettingsLayout({
  children,
  params: { locale },
}: Props) {
  const d = await getDictionary(locale);
  return <div className="flex flex-col">{children}</div>;
}
