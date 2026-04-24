import { createReactQueryApiClient } from "@akashnetwork/react-query-sdk/notifications/create-react-query-client";
import { requestFn } from "@openapi-qraft/react";

import { browserEnvConfig } from "@src/config/browser-env.config";
import { ApiUrlService } from "@src/services/api-url/api-url.service";
import * as walletUtils from "@src/utils/walletUtils";
import { createChildContainer } from "../container/createContainer";
import { DeploymentStorageService } from "../deployment-storage/deployment-storage.service";
import { createAppRootContainer } from "./app-di-container";

const rootContainer = createAppRootContainer({
  runtimeEnv: "browser",
  BASE_API_MAINNET_URL: browserEnvConfig.NEXT_PUBLIC_BASE_API_MAINNET_URL,
  BASE_PROVIDER_PROXY_URL: browserEnvConfig.NEXT_PUBLIC_PROVIDER_PROXY_URL,
  apiUrlService: () => new ApiUrlService(browserEnvConfig)
});

export const services = createChildContainer(rootContainer, {
  notificationsApi: () =>
    createReactQueryApiClient({
      requestFn,
      baseUrl: "/api/proxy",
      queryClient: services.queryClient
    }),
  consoleApiHttpClient: () =>
    services.applyAxiosInterceptors(services.createAxios({ baseURL: services.publicConfig.NEXT_PUBLIC_BASE_API_MAINNET_URL })),
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
