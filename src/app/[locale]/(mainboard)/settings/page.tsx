import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Settings() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }

  return redirect("/settings/general");
}
