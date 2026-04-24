import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";

import { useServices } from "@src/context/ServicesProvider";
import type { AllowanceType } from "@src/types/grant";
import { ApiUrlService, loadWithPagination } from "@src/utils/apiUtils";
import { QueryKeys } from "./queryKeys";

async function getAllowancesGranted(chainApiHttpClient: AxiosInstance, address: string) {
  return await loadWithPagination<AllowanceType[]>(ApiUrlService.allowancesGranted("", address), "allowances", 1000, chainApiHttpClient);
}

export function useAllowancesGranted(address: string, options: Omit<UseQueryOptions<AllowanceType[]>, "queryKey" | "queryFn"> = {}) {
  const { chainApiHttpClient } = useServices();

  return useQuery({
    queryKey: address ? QueryKeys.getAllowancesGranted(address) : [],
    queryFn: () => getAllowancesGranted(chainApiHttpClient, address),
    ...options,
    enabled: options.enabled !== false && !!address && !chainApiHttpClient.isFallbackEnabled
  });
}
