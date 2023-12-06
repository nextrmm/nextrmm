"use client";

import { usePathname } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { I18nDict } from "~/types";

interface Props {
  dict: I18nDict;
}

export function Menu({ dict }: Props) {
  const parts = usePathname().split("/");
  const path = `/${parts[2]}${parts[3] ? "/" + parts[3] : ""}`;
  return (
    <div>
      <ul className="flex space-x-4">
        <li
          className={cn(
            "border-b-2 border-primary p-2 font-semibold text-primary",
          )}
        >
          {dict["menu"]}
        </li>
      </ul>
      <Separator />
    </div>
  );
}
