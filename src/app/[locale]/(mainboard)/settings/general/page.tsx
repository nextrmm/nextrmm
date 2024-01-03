import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Settings() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="px-4">
      <div className="pt-4 text-slate-500">General Settings</div>
    </div>
  );
}
