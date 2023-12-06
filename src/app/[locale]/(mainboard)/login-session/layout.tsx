import type { Locale } from "~/i18n-config";
import { getDictionary } from "~/lib/dictionary";
import { Menu } from "./_components/menu";

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

export default async function DevicesLayout({
  children,
  params: { locale },
}: Props) {
  const d = await getDictionary(locale);
  return (
    <div className="flex flex-col">
      <Menu dict={d["login-session"]} />
      {children}
    </div>
  );
}
