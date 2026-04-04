import { useState, useEffect, useCallback } from "react";
import type { PlotRow } from "@/lib/database.types";
import type { HostStats } from "@/types";
import { fetchHostPlots, fetchHostStats } from "@/services/hostService";

interface UseHostDashboardResult {
  stats: HostStats | null;
  plots: PlotRow[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useHostDashboard(
  hostId: string | undefined
): UseHostDashboardResult {
  const [stats, setStats] = useState<HostStats | null>(null);
  const [plots, setPlots] = useState<PlotRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!hostId) {
      setIsLoading(false);
      setError("Not signed in");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [statsData, plotsData] = await Promise.all([
        fetchHostStats(hostId),
        fetchHostPlots(hostId),
      ]);
      setStats(statsData);
      setPlots(plotsData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, plots, isLoading, error, refresh: load };
}
