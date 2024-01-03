import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { ActiveDevices } from "../../../../../components/active-devices";

export default async function Settings() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="px-4">
      <div className="mt-8 text-lg font-normal">Web sessions</div>
      <div className="border-inherit/50 mt-4 h-full w-full rounded-md border bg-gray-100 bg-opacity-10 bg-clip-padding backdrop-blur-lg">
        <ActiveDevices currentSession={session.currentSession} />
      </div>
    </div>
  );
}
