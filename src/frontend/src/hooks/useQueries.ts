import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnalysisRecord, MarketData } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllAnalyses() {
  const { actor, isFetching } = useActor();
  return useQuery<AnalysisRecord[]>({
    queryKey: ["analyses"],
    queryFn: async () => {
      if (!actor) return [];
      const results = await actor.getAllAnalyses();
      // Sort by timestamp descending (newest first)
      return [...results].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAnalysisById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<AnalysisRecord | null>({
    queryKey: ["analysis", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getAnalysisById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useAnalyzeMarket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (marketData: MarketData): Promise<AnalysisRecord> => {
      if (!actor) throw new Error("Actor not available");
      const id = await actor.analyzeMarketData(marketData);
      const result = await actor.getAnalysisById(id);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}
