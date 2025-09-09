"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

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
    });
  }, [roomID]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="p-2 bg-purple-600 text-white text-lg font-semibold">
        Consultation Room: {roomID}
      </div>
      <div ref={containerRef} className="flex-1" />
    </div>
  );
}
