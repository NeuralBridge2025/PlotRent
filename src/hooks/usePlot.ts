import { useState, useEffect, useCallback } from "react";
import type { Plot } from "@/types";
import { fetchPlotById } from "@/services/plotService";

interface UsePlotResult {
  plot: Plot | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePlot(id: string | undefined): UsePlotResult {
  const [plot, setPlot] = useState<Plot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      setError("No plot ID provided");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPlotById(id);
      if (!data) {
        setError("Plot not found");
      } else {
        setPlot(data);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load plot";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { plot, isLoading, error, refresh: load };
}
