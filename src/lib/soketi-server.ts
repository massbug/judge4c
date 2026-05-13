import "server-only";

import Pusher from "pusher";

const appId = process.env.SOKETI_DEFAULT_APP_ID;
const key = process.env.NEXT_PUBLIC_SOKETI_DEFAULT_APP_KEY;
const secret = process.env.SOKETI_DEFAULT_APP_SECRET;
const host = process.env.SOKETI_HOST ?? "localhost";
const port = process.env.SOKETI_PORT ?? "6001";
const useTLS = process.env.SOKETI_USE_TLS === "true";

export const pusherServer =
  appId && key && secret
    ? new Pusher({
        appId,
        key,
        secret,
        host,
        port,
        useTLS,
      })
    : null;
