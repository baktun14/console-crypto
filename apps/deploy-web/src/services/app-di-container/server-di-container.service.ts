import { createAPIClient } from "@akashnetwork/react-query-sdk/notifications";
import { requestFn } from "@openapi-qraft/react";

import { serverEnvConfig } from "@src/config/server-env.config";
import { ApiUrlService } from "../api-url/api-url.service";
import { clientIpForwardingInterceptor } from "../client-ip-forwarding/client-ip-forwarding.interceptor";
import { createChildContainer } from "../container/createContainer";
import { TurnstileVerifierService } from "../turnstile-verifier/turnstile-verifier.service";
import { createAppRootContainer } from "./app-di-container";

const rootContainer = createAppRootContainer({
  ...serverEnvConfig,
  runtimeEnv: "nodejs",
  BASE_PROVIDER_PROXY_URL: serverEnvConfig.NEXT_PUBLIC_PROVIDER_PROXY_URL,
  globalRequestMiddleware: clientIpForwardingInterceptor,
  apiUrlService: () => new ApiUrlService(serverEnvConfig)
});

export const services = createChildContainer(rootContainer, {
  notificationsApi: () =>
    createAPIClient({
      requestFn,
      baseUrl: services.apiUrlService.getBaseApiUrlFor(services.privateConfig.NEXT_PUBLIC_DEFAULT_NETWORK_ID)
    }),
  privateConfig: () => Object.freeze(serverEnvConfig),
  consoleApiHttpClient: () => services.applyAxiosInterceptors(services.createAxios()),
  captchaVerifier: () =>
    new TurnstileVerifierService(services.externalApiHttpClient, {
      secretKey: services.privateConfig.TURNSTILE_SECRET_KEY,
      turnstileBypassSecretKey: services.privateConfig.TURNSTILE_BYPASS_SECRET_KEY,
      bypassSecretKeyVerificationToken: services.privateConfig.E2E_TESTING_CLIENT_TOKEN
    })
});

export type AppServices = typeof services;
