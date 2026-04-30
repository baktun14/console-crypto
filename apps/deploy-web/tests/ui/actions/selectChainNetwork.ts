import type { NetworkId } from "@akashnetwork/chain-sdk";
import type { Page } from "@playwright/test";

// Test-fixture NetworkId values map to the internal store ids defined in
// packages/net netConfigData. Going through the UI (App Settings → Select
// Network → Save) requires the wallet to stay connected through the route
// transition; cosmos-kit's auto-reconnect briefly flips isWalletConnected on
// nav, which trips the SettingsContainer route guard and bounces back to "/".
// Switching the network by writing the store key directly avoids all of that.
const STORAGE_KEY = "selectedNetworkId";
const STORE_NETWORK_ID: Record<NetworkId, string> = {
  mainnet: "mainnet",
  sandbox: "sandbox-2",
  testnet: "testnet"
};

export async function selectChainNetwork(page: Page, networkId: NetworkId = "sandbox") {
  const target = STORE_NETWORK_ID[networkId] ?? networkId;
  const current = await page.evaluate(key => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }, STORAGE_KEY);

  if (current === target) return;

  await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [STORAGE_KEY, target] as const);
  await page.reload({ waitUntil: "networkidle" });
}
