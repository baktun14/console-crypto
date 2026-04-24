import type { FeatureFlag } from "@src/types/feature-flags";

/**
 * Stub for feature flags after removing @unleash/nextjs.
 * All flags default to true (enabled).
 */
export const useFlag: FeatureFlagHook = () => true;

type FeatureFlagHook = (flag: FeatureFlag) => boolean;
