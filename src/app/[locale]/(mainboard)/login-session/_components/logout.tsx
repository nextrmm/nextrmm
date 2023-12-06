"use client";

import { Icons } from "~/components/icons";

interface Props {
  sessionId: string;
}
function Logout({ sessionId }: Props) {
  const delete_devices = async (sessionId) => {
    const response = await fetch("/api/device_logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.log(response.statusText);
    }
  };

  return (
    <div onClick={() => delete_devices(sessionId)}>
      <Icons.logout className="text-gray-600" />
    </div>
  );
}

export default Logout;
