"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Loader2 } from "lucide-react";

export default function ConsultPage() {
  const containerRef = useRef(null);
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID");

  useEffect(() => {
    if (!roomID) return;

    const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

    const userID = String(Date.now());
    const userName = "Participant_" + userID;

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
  }, [roomID]);

  if (!roomID) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Joining consultation...
        </p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="p-4 bg-purple-600 dark:bg-purple-800 text-white shadow-md flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-semibold">
          Consultation Room: <span className="text-yellow-300">{roomID}</span>
        </h1>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-white text-purple-700 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          Exit
        </button>
      </header>

      {/* Video Container */}
      <div
        ref={containerRef}
        className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-t-xl shadow-inner"
      />
    </div>
  );
}
