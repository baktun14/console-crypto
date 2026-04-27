import type { NextApiRequest, NextApiResponse } from "next";

import { proxyRequest } from "@src/lib/nextjs/proxyRequest/proxyRequest";
import { browserEnvConfig } from "@src/config/browser-env.config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.url?.replace(/^\/api\/proxy\//, "/") || "";

  const headers: Record<string, string> = {};

  // Only forward cf-connecting-ip when it was actually set by an upstream Cloudflare
  // edge — synthesizing it from req.socket.remoteAddress (e.g. "::1" in local dev)
  // makes Cloudflare's WAF flag the request and return 403.
  const cfConnectingIp = req.headers["cf-connecting-ip"];
  if (typeof cfConnectingIp === "string" && cfConnectingIp.length > 0) {
    headers["cf-connecting-ip"] = cfConnectingIp;
  }

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
