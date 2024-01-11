"use client";

import * as React from "react";
import { User } from "next-auth";
import { Header } from "~/components/header";
import { AsideSettings } from "~/components/settings-aside";

interface Props {
  user: User;
  children: React.ReactNode;
}

export function SettingsSideNav({ user, children }: Props) {
  return (
    <div
      className={`container grid max-w-none flex-1 px-0 transition-[width] md:grid-cols-[200px_1fr]`}
    >
      <aside className="hidden md:flex">
        <AsideSettings />
      </aside>
      <div className="relative">
        <Header user={user} />
        <main className="flex w-full flex-col overflow-y-auto ">
          {children}
        </main>
      </div>
    </div>
  );
}
