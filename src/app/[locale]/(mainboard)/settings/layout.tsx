import { redirect } from "next/navigation";
import { SettingsSideNav } from "~/components/settings-layout";
import type { Locale } from "~/i18n-config";
import { getDictionary } from "~/lib/dictionary";
import { getServerAuthSession } from "~/server/auth";

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

export default async function SettingsLayout({
  children,
  params: { locale },
}: Props) {
  //Check if user is logged in
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }
  const d = await getDictionary(locale);
  return (
    <SettingsSideNav user={session.user}>
      <div className="flex flex-col">{children}</div>
    </SettingsSideNav>
  );
}
