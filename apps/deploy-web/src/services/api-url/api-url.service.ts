import { type NetworkId, SANDBOX_ID, TESTNET_ID } from "@akashnetwork/chain-sdk/web";

import type { BrowserEnvConfig } from "@src/config/env-config.schema";

type ApiUrlConfig = Pick<BrowserEnvConfig, "NEXT_PUBLIC_BASE_API_MAINNET_URL" | "NEXT_PUBLIC_BASE_API_TESTNET_URL" | "NEXT_PUBLIC_BASE_API_SANDBOX_URL">;

export class ApiUrlService {
  constructor(private readonly config: ApiUrlConfig) {}

  getBaseApiUrlFor(network: NetworkId | undefined): string {
    switch (network) {
      case TESTNET_ID:
        return this.config.NEXT_PUBLIC_BASE_API_TESTNET_URL;
      case SANDBOX_ID:
        return this.config.NEXT_PUBLIC_BASE_API_SANDBOX_URL;
      default:
        return this.config.NEXT_PUBLIC_BASE_API_MAINNET_URL;
    }
  }
}
