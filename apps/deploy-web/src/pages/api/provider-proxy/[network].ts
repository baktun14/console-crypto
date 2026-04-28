import type { NextApiRequest, NextApiResponse } from "next";

import { proxyRequest } from "@src/lib/nextjs/proxyRequest/proxyRequest";

const ALLOWED_NETWORKS = new Set(["mainnet", "sandbox", "testnet"]);
const PROVIDER_PROXY_TEMPLATE = "https://console.akash.network/provider-proxy-%{NETWORK}";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const network = String(req.query.network || "");

  if (!ALLOWED_NETWORKS.has(network)) {
    res.status(400).json({ error: "Unsupported network", received: network });
    return;
  }

  const target = PROVIDER_PROXY_TEMPLATE.replace("%{NETWORK}", network) + "/";

  const headers: Record<string, string> = {};

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
    target,
    headers,
    timeout: 120_000,
    onError: error => {
      console.error("PROVIDER_PROXY_REQUEST_ERROR", error);
    }
  });
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false
  }
};
