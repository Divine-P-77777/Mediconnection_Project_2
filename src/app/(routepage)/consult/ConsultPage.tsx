"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Loader2 } from "lucide-react";

export default function ConsultPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID");

  useEffect(() => {
    if (!roomID || !containerRef.current) return;

    const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

    if (!appID || !serverSecret) {
      console.error("Zego credentials missing");
      return;
    }

    const userID = crypto.randomUUID();
    const userName = `Participant_${userID.slice(0, 6)}`;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
      showScreenSharingButton: true,
      sharedLinks: [
        {
          name: "Invite Link",
          url: `${window.location.origin}/consult?roomID=${roomID}`,
        },
      ],
    });

    return () => {
      zp.destroy();
    };
  }, [roomID]);

  if (!roomID) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Joining consultation...
        </p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="p-4 bg-purple-600 text-white flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          Consultation Room: <span className="text-yellow-300">{roomID}</span>
        </h1>
        <button
          onClick={() => window.location.replace("/")}
          className="bg-white text-purple-700 px-3 py-1 rounded-lg"
        >
          Exit
        </button>
      </header>

      <div
        ref={containerRef}
        className="flex-1 bg-gray-200 dark:bg-gray-800"
      />
    </div>
  );
}
