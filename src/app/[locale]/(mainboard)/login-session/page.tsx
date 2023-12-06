import dynamic from "next/dynamic";
import { Icons } from "~/components/icons";
import { Separator } from "~/components/ui/separator";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

const Logout = dynamic(() => import("./_components/logout"), { ssr: false });

export default async function Devices() {
  const session = await getServerAuthSession();

  let user_sessions = await db.session.findMany({
    where: {
      userId: session!.user.id,
      expires: {
        gt: new Date(),
      },
    },
  });
  let devices = [];
  for (let i = 0; i < user_sessions.length; i++) {
    const login_session = await db.loginSession.findUnique({
      where: {
        sessionId: user_sessions[i]!.id,
      },
    });
    if (login_session) {
      devices.push(login_session);
    }
  }
  let device_name_list = ["Windows", "Android", "IOS", "Other"];
  let device_icon_list = [
    <Icons.windows />,
    <Icons.android />,
    <Icons.apple />,
    <Icons.otherDevice />,
  ];
  let devices_list: any[][] = [];

  device_name_list.forEach((device_name) => {
    let device = devices.filter((device) => {
      return device.os === device_name;
    });
    devices_list.push(device);
  });

  return (
    <div className="mx-10 my-4">
      <p className="my-4 text-sm">
        You are signed in on these devices. There might be multiple activity
        sessions from the same device.
      </p>

      {devices_list.map((devices) => {
        return (
          <div
            key={device_name_list[devices_list.indexOf(devices)]}
            className="mx-6 mb-6 flex flex-row justify-around rounded-lg border p-6 shadow"
            style={{ display: devices.length > 0 ? "flex" : "none" }}
          >
            <div className="flex flex-1 font-bold text-gray-800">
              <span className="mr-2">
                {device_icon_list[devices_list.indexOf(devices)]}
              </span>
              {devices.length} sessions on{" "}
              {device_name_list[devices_list.indexOf(devices)]} device(s)
            </div>
            <div className="flex flex-1 flex-col">
              {devices.map((device) => {
                return (
                  <div key={device.id} className="">
                    <div className="flex flex-row justify-between p-1">
                      <div className="flex flex-col">
                        <span className="mb-2 text-sm font-bold text-gray-700">
                          {device.city}, {device.country}
                        </span>

                        <span className="mb-2 text-sm text-gray-600">
                          {new Date(device.createdAt).toLocaleString("zh-CN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                        <span className="mb-2 text-sm text-gray-600">
                          {device.browser}
                        </span>
                      </div>
                      <Logout
                        sessionId={device.sessionId ? device.sessionId : ""}
                      />
                    </div>
                    {devices.indexOf(device) !== devices.length - 1 ? (
                      <div className="mb-3">
                        <Separator />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
