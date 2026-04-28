import { browserEnvConfig } from "@src/config/browser-env.config";
import { ApiUrlService } from "@src/services/api-url/api-url.service";
import * as walletUtils from "@src/utils/walletUtils";
import { createChildContainer } from "../container/createContainer";
import { DeploymentStorageService } from "../deployment-storage/deployment-storage.service";
import { createAppRootContainer } from "./app-di-container";

// Console API (/v1/*) requests are proxied through Next's /api/proxy route so the
// browser only ever talks to its own origin. The proxy forwards server-side to
// NEXT_PUBLIC_API_BASE_URL (defaults to https://console-api.akash.network).
const CONSOLE_API_BROWSER_BASE_URL = "/api/proxy";

const rootContainer = createAppRootContainer({
  runtimeEnv: "browser",
  BASE_API_MAINNET_URL: CONSOLE_API_BROWSER_BASE_URL,
  BASE_PROVIDER_PROXY_URL: browserEnvConfig.NEXT_PUBLIC_PROVIDER_PROXY_URL,
  apiUrlService: () => new ApiUrlService(browserEnvConfig)
});

export const services = createChildContainer(rootContainer, {
  consoleApiHttpClient: () => services.applyAxiosInterceptors(services.createAxios({ baseURL: CONSOLE_API_BROWSER_BASE_URL })),
  publicConsoleApiHttpClient: () => services.applyAxiosInterceptors(services.createAxios()),
  fallbackChainApiHttpClient: () =>
    services.applyAxiosInterceptors(services.createAxios(), {
      request: [
        config => {
          config.baseURL = services.apiUrlService.getBaseApiUrlFor(services.networkStore.selectedNetworkId);
          return config;
        }
      ]
    }),
  storedWalletsService: () => walletUtils,
  deploymentLocalStorage: () => new DeploymentStorageService(localStorage, services.networkStore),
  windowLocation: () => window.location,
  windowHistory: () => window.history
});
