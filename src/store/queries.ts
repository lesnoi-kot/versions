import { useQueries, useQueryClient } from "@tanstack/react-query";

import { useSelectedSourcesId } from "store/sources";
import { useAPI } from "context/api";

export function useSelectedSources() {
  const api = useAPI();
  const queryClient = useQueryClient();
  const selectedSources = useSelectedSourcesId();

  const queryResults = useQueries({
    queries: selectedSources.map((id) => ({
      queryKey: ["dataset", id],
      queryFn: () => api.getSource(id),
      staleTime: Infinity,
    })),
  });

  const isLoading = queryResults.map((q) => q.isLoading).some(Boolean);
  const isSuccess = queryResults.map((q) => q.isSuccess).every(Boolean);
  const isError = queryResults.map((q) => q.isError).some(Boolean);
  const errors = queryResults.map((q) => q.error);
  const sources = queryResults.map((q) => q.data);

  sources.forEach((source) => {
    if (!source) {
      return;
    }

    if (source.isFetching) {
      queryClient.setQueryDefaults(["dataset", source.id], {
        refetchInterval: 3000,
      });
    } else {
      queryClient.setQueryDefaults(["dataset", source.id], {
        refetchInterval: Infinity,
      });
    }
  });

  return {
    isLoading,
    isSuccess,
    isError,
    errors,
    sources,
  };
}
