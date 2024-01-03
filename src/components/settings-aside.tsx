"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingscontrolboardConfig } from "~/config/settings-control-board";
import { cn } from "~/lib/utils";
import { SideNavItem } from "~/types";

export function AsideSettings() {
  const upItems: SideNavItem[] = settingscontrolboardConfig.settingsSidebarNav;
  const parts = usePathname().split("/");
  const path = `/${parts[2]}/${parts[3]}`;
  if (!upItems?.length) {
    return null;
  }

  return (
    <div>
      <div className="ml-2 pt-4 text-lg font-medium text-slate-500">
        Settings
      </div>

      {upItems.map((item, index) => {
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : item.href}>
              <span
                className={cn(
                  "group flex items-center border-l-4 border-transparent px-4 py-2 text-sm font-semibold hover:bg-accent",
                  path === item.href
                    ? "rounded-sm text-violet-500"
                    : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </div>
  );
}
