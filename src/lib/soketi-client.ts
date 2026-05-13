"use client";

import Pusher from "pusher-js";

const key = process.env.NEXT_PUBLIC_SOKETI_DEFAULT_APP_KEY ?? "judge4c_key";
const wsHost = process.env.NEXT_PUBLIC_SOKETI_HOST ?? "localhost";
const wsPort = Number(process.env.NEXT_PUBLIC_SOKETI_PORT ?? "6001");
const forceTLS = process.env.NEXT_PUBLIC_SOKETI_USE_TLS === "true";

let instance: Pusher | null = null;

export const getPusherClient = () => {
  if (!key) return null;
  if (instance) return instance;

  instance = new Pusher(key, {
    wsHost,
    wsPort,
    forceTLS,
    enabledTransports: ["ws", "wss"],
    cluster: "mt1",
  });

  return instance;
};
