"use client";

import { User } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { TSession } from "~/lib/validation/session";
import { api } from "~/trpc/react";

interface ActiveUserSessionsProps {
  currentSession: TSession;
}
const formatDate = (date: Date) => {
  return date.toLocaleString(); // You can adjust this to your desired date format
};

const DesktopSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="569.4 86.3 83.6 48.2"
    className="h-20 w-20"
  >
    <path
      fill="var(--cl-chassis-back, black)"
      d="M577 89.8c0-1.4.2-2 .6-2.6.5-.5 1.2-.9 2.8-.9h61.7c1.4 0 2 .3 2.5.8s.7 1.2.7 2.7v41c0 1.4-.2 2-.5 2.4a2.7 2.7 0 0 1-2.2 1.1h-63c-.8 0-1.6-.3-2-1-.4-.4-.6-1-.6-2.5v-41Z"
    ></path>
    <path
      fill="var(--cl-chassis-screen, #323232)"
      d="M578.4 132.9h65.5c.3 0 .6-.2.8-.4.2-.2.2-.5.2-1.4V89.8c0-1.2-.1-2-.6-2.4-.5-.5-1-.7-2.2-.7h-61.7c-1.3 0-2 .3-2.5.8-.4.4-.5 1-.5 2.3v41.3c0 .9 0 1.2.2 1.4.2.2.5.4.8.4Z"
    ></path>
    <path
      fill-rule="evenodd"
      stroke="var(--cl-chassis-back1, 'gold')"
      stroke-width="0.3"
      d="M611.2 88.5a.3.3 0 1 0 0-.5.3.3 0 1 0 0 .5Z"
      clip-rule="evenodd"
    ></path>
    <path
      fill="var(--cl-chassis-bottom, #191919)"
      fill-rule="evenodd"
      d="M569.4 133.3v-.5H653v.5s-1.9.6-4 .8c-1.4.1-3.7.4-8.9.4h-57.4c-4.5 0-8.3-.3-10-.5-1.7-.2-3.3-.7-3.3-.7Z"
      clip-rule="evenodd"
    ></path>
    <path
      fill="var(--cl-screen, #111111)"
      fill-rule="evenodd"
      d="M579.7 89.5h63v39.4h-63V89.5Z"
      clip-rule="evenodd"
    ></path>
  </svg>
);

const MobileSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="670.6 72.3 84 76"
    className="h-20 w-20"
  >
    <path
      fill="var(--cl-chassis-screen, #6D6D6D)"
      fill-rule="evenodd"
      d="M712.5 107.2v-.6h.1l.2.1v7.2a.1.1 0 0 1-.2.2l-.1-.3v-6.6Z"
      clip-rule="evenodd"
    ></path>
    <path
      fill="var(--cl-chassis-back, #6D6D6D)"
      fill-rule="evenodd"
      d="M697.4 100v-.7h-.2a.1.1 0 0 0-.1.2v4.4s0 .2.2.2V100Z"
      clip-rule="evenodd"
    ></path>
    <path
      fill="var(--cl-chassis-screen, #6D6D6D)"
      fill-rule="evenodd"
      d="M697.4 94v-.7h-.2a.1.1 0 0 0-.1.2v4.4s0 .2.2.2V94Z"
      clip-rule="evenodd"
    ></path>
    <path
      fill="var(--cl-chassis-back, #363636)"
      d="M722.7 78.6c3.6 0 5.5 2.1 5.5 5.7v52.4c0 3.4-2.3 5.3-5.8 5.3H703c-3.8 0-5.8-2.4-5.7-5.4V84.3c0-3.6 2-5.7 5.6-5.7h19.8Z"
    ></path>
    <path
      fill="var(--cl-chassis-screen, #363636)"
      stroke="var(--cl-chassis-bottom, black)"
      stroke-width="0.5"
      d="M722.3 79.2c3.7 0 5.4 1.8 5.4 5.4v52c0 3.2-2.2 5-5.5 5h-19c-3.2 0-5.4-2-5.4-5v-52c0-3.6 1.8-5.4 5.5-5.4h19Z"
    ></path>
    <path
      fill="var(--cl-screen, black)"
      fill-rule="evenodd"
      d="M704.9 80.3c.2 0 .3.1.3.4v.2c0 .9.8 1.7 1.6 1.7h11.8c1 0 1.7-.8 1.7-1.7v-.2c0-.3.1-.4.3-.4h3c1.6 0 3 1.7 3 3.3V137c0 1.7-1.5 3.3-3.4 3.3h-21c-2.1 0-3.3-1.3-3.3-3.2V83.6c0-1.6 1.3-3.3 2.9-3.3h3Z"
      clip-rule="evenodd"
    ></path>
    <path
      fill-rule="evenodd"
      d="M715.3 81.2a.3.3 0 0 0-.2-.4.3.3 0 1 0-.2.6.3.3 0 0 0 .4-.2Zm-5.1-.2c0 .2 0 .3.2.3h2.9a.3.3 0 0 0 .2-.3.3.3 0 0 0-.2-.2h-2.9a.3.3 0 0 0-.2.2Z"
      clip-rule="evenodd"
    ></path>
  </svg>
);

export function ActiveDevices({ currentSession }: ActiveUserSessionsProps) {
  const allSessions = api.session.getByUser.useQuery({
    userId: currentSession.userId,
  });

  const deleteUserMutation = api.session.deleteBySessionToken.useMutation();
  const handleSignOut = async (sessionToken: string) => {
    try {
      await deleteUserMutation.mutateAsync({
        sessionToken,
      });
      allSessions.refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const sessionList = allSessions?.data || [];

  const renderDeviceInformation = (session: any) => {
    const { deviceInfo } = session;

    if (!deviceInfo || typeof deviceInfo !== "object") {
      return null;
    }

    const isDesktop = deviceInfo.deviceType === "Desktop";

    const deviceSVG = isDesktop ? <DesktopSVG /> : <MobileSVG />;

    return (
      <div className="mt-2  flex items-center gap-16 p-2">
        {deviceSVG}
        <div className="">
          <div className="font-medium">{deviceInfo.os}</div>
          <div className="text-slate-500">{deviceInfo.browser}</div>
          <div className="text-slate-500">{deviceInfo.ip}</div>
          <div className="text-slate-500">
            {deviceInfo.city}, {deviceInfo.country}
          </div>
          <div className="text-slate-500">
            First Sign In: {formatDate(session.createdAt)}
          </div>
          <div className="text-slate-500">
            Last activity: {formatDate(session.lastActivity)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {sessionList.map((session, index) => (
        <div
          key={session.id}
          className={index === sessionList.length - 1 ? "" : "border-b"}
        >
          <div className="flex h-full w-full  items-center justify-between p-2  ">
            {renderDeviceInformation(session)}
            {currentSession.sessionToken == session.sessionToken ? (
              <div className="mr-6 rounded-md bg-primary p-2 font-medium text-white">
                Current Session
              </div>
            ) : (
              <Button
                variant="destructive"
                className="mr-6"
                onClick={() => handleSignOut(session.sessionToken)}
              >
                Sign out
              </Button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
