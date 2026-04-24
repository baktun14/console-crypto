import type { NextApiRequest, NextApiResponse } from "next";

import { proxyRequest } from "@src/lib/nextjs/proxyRequest/proxyRequest";
import { browserEnvConfig } from "@src/config/browser-env.config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.url?.replace(/^\/api\/proxy\//, "/") || "";

  const headers: Record<string, string> = {
    "cf-connecting-ip": String(req.headers["cf-connecting-ip"] || req.socket.remoteAddress || "")
  };

  if (req.headers["traceparent"]) {
    headers["traceparent"] = req.headers["traceparent"] as string;
  }

  if (req.headers["baggage"]) {
    headers["baggage"] = req.headers["baggage"] as string;
  }

  await proxyRequest(req, res, {
    target: browserEnvConfig.NEXT_PUBLIC_API_BASE_URL + url,
    headers,
    onError: error => {
      console.error("PROXY_API_REQUEST_ERROR", error);
    }
  });
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false
  }
};
