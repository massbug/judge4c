import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processSubmission } from "@/inngest/functions/process-submission";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processSubmission],
});
