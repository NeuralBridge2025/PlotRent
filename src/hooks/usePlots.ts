import { useState, useEffect, useCallback } from "react";
import type { Plot, PlotFilters } from "@/types";
import { fetchPlots } from "@/services/plotService";

interface UsePlotsResult {
  plots: Plot[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePlots(filters?: PlotFilters): UsePlotsResult {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPlots(filters);
      setPlots(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load plots";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  return { plots, isLoading, error, refresh: load };
}
