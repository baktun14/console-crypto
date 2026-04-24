import { z } from "zod";

const networkId = z.enum(["mainnet", "sandbox", "testnet"]);
const coercedBoolean = () => z.enum(["true", "false"]).transform(val => val === "true");

export const browserEnvSchema = z.object({
  NEXT_PUBLIC_DEFAULT_NETWORK_ID: networkId.optional().default("mainnet"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL: z.string(),
  NEXT_PUBLIC_STATS_APP_URL: z.string().url(),
  NEXT_PUBLIC_PROVIDER_PROXY_URL: z.string(),
  NEXT_PUBLIC_NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
  NEXT_PUBLIC_DEFAULT_INITIAL_DEPOSIT: z.number({ coerce: true }).optional().default(500000),
  NEXT_PUBLIC_BASE_API_MAINNET_URL: z.string(),
  NEXT_PUBLIC_BASE_API_TESTNET_URL: z.string(),
  NEXT_PUBLIC_BASE_API_SANDBOX_URL: z.string(),
  NEXT_PUBLIC_REDIRECT_URI: z.string().url(),
  NEXT_PUBLIC_GITHUB_APP_INSTALLATION_URL: z.string().url(),
  NEXT_PUBLIC_BITBUCKET_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_GITLAB_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_CI_CD_IMAGE_NAME: z.string(),
  NEXT_PUBLIC_BASE_TEMPLATES_URL: z.string().url()
});

export const serverEnvSchema = browserEnvSchema.extend({
  MAINTENANCE_MODE: coercedBoolean().optional().default("false"),
  BASE_API_MAINNET_URL: z.string().url(),
  BASE_API_TESTNET_URL: z.string().url(),
  BASE_API_SANDBOX_URL: z.string().url(),
  GITHUB_CLIENT_SECRET: z.string(),
  BITBUCKET_CLIENT_SECRET: z.string(),
  GITLAB_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_CI_CD_IMAGE_NAME: z.string(),
  NEXT_PUBLIC_PROVIDER_PROXY_URL: z.string(),
  NEXT_PUBLIC_DEFAULT_NETWORK_ID: networkId.optional().default("mainnet"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
  E2E_TESTING_CLIENT_TOKEN: z.string({
    required_error: "This token is used to adjust configuration of the app for e2e testing. Can be any random string."
  }),
  DEFAULT_REST_API_NODE_URL_MAINNET: z.string().url().optional(),
  DEFAULT_RPC_NODE_URL_MAINNET: z.string().url().optional()
});

export type BrowserEnvConfig = z.infer<typeof browserEnvSchema>;
export type ServerEnvConfig = z.infer<typeof serverEnvSchema>;

export const validateStaticEnvVars = (config: Record<string, unknown>) => browserEnvSchema.parse(config);
export const validateRuntimeEnvVars = (config: Record<string, unknown>) => {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.log("Skipping validation of serverEnvConfig during build");
    return config as ServerEnvConfig;
  } else {
    return serverEnvSchema.parse(config);
  }
};
