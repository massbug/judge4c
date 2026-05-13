"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPusherClient } from "@/lib/soketi-client";

interface SubmissionRealtimeListenerProps {
  problemId: string;
}

export const SubmissionRealtimeListener = ({
  problemId,
}: SubmissionRealtimeListenerProps) => {
  const router = useRouter();

  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;

    const channelName = `problem-${problemId}`;
    const channel = pusher.subscribe(channelName);

    const handleStatusUpdate = () => {
      router.refresh();
    };

    channel.bind("status-update", handleStatusUpdate);

    return () => {
      channel.unbind("status-update", handleStatusUpdate);
      pusher.unsubscribe(channelName);
    };
  }, [problemId, router]);

  return null;
};
