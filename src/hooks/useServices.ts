import { useState, useEffect, useCallback } from "react";
import type { Service } from "@/types";
import { fetchServices } from "@/services/serviceService";

interface UseServicesResult {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useServices(category?: string): UseServicesResult {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchServices(category);
      setServices(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load services";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  return { services, isLoading, error, refresh: load };
}
