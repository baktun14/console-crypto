import type { NextApiRequest, NextApiResponse } from "next";

import { proxyRequest } from "@src/lib/nextjs/proxyRequest/proxyRequest";
import { browserEnvConfig } from "@src/config/browser-env.config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.url?.replace(/^\/api\/proxy\//, "/") || "";

  // Headers from the incoming request (cf-connecting-ip, x-forwarded-for, traceparent,
  // baggage, etc.) are forwarded transparently by proxyRequest. We don't need to
  // re-inject them here, and we deliberately don't synthesize cf-connecting-ip from
  // the socket — Cloudflare's WAF flags forged values and returns 403.
  await proxyRequest(req, res, {
    target: browserEnvConfig.NEXT_PUBLIC_API_BASE_URL + url,
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
