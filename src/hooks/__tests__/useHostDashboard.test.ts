import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useHostDashboard } from "@/hooks/useHostDashboard";
import { fetchHostPlots, fetchHostStats } from "@/services/hostService";
import type { HostStats } from "@/types";
import type { PlotRow } from "@/lib/database.types";

jest.mock("@/lib/supabase");
jest.mock("@/services/hostService");

const mockFetchHostPlots = fetchHostPlots as jest.MockedFunction<typeof fetchHostPlots>;
const mockFetchHostStats = fetchHostStats as jest.MockedFunction<typeof fetchHostStats>;

const ZERO_STATS: HostStats = {
  monthly_earnings: 0,
  earnings_trend: 0,
  active_plots: 0,
  occupancy_rate: 0,
};

const MOCK_PLOT: PlotRow = {
  id: "plot-001",
  host_id: "host-abc",
  title: "Sunny Garden Plot",
  description: "A lovely plot",
  price_per_month: 45,
  size_sqm: 25,
  latitude: 38.7223,
  longitude: -9.1393,
  address: "Rua da Horta 10",
  city: "Lisbon",
  country: "Portugal",
  soil_type: "Loamy",
  sun_exposure: "Full Sun",
  utilities: ["Water Access"],
  tags: null,
  images: ["https://example.com/plot1.jpg"],
  rating: null,
  review_count: 0,
  is_active: true,
  instant_book: false,
  created_at: "2026-04-05T10:00:00Z",
  updated_at: "2026-04-05T10:00:00Z",
};

afterEach(() => {
  jest.resetAllMocks();
});

describe("useHostDashboard", () => {
  it("starts in loading state", () => {
    mockFetchHostStats.mockReturnValue(new Promise(() => {}));
    mockFetchHostPlots.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useHostDashboard("host-id"));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.stats).toBeNull();
    expect(result.current.plots).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("returns zeroed stats and empty plots for new host", async () => {
    mockFetchHostStats.mockResolvedValue(ZERO_STATS);
    mockFetchHostPlots.mockResolvedValue([]);

    const { result } = renderHook(() => useHostDashboard("new-host-id"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.stats).toEqual(ZERO_STATS);
    expect(result.current.plots).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("returns stats and plots for host with data", async () => {
    const stats: HostStats = {
      monthly_earnings: 90,
      earnings_trend: 0,
      active_plots: 2,
      occupancy_rate: 50,
    };
    mockFetchHostStats.mockResolvedValue(stats);
    mockFetchHostPlots.mockResolvedValue([MOCK_PLOT]);

    const { result } = renderHook(() => useHostDashboard("host-abc"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.stats).toEqual(stats);
    expect(result.current.plots).toHaveLength(1);
    expect(result.current.plots[0].id).toBe("plot-001");
    expect(result.current.error).toBeNull();
  });

  it("sets error state when service throws", async () => {
    mockFetchHostStats.mockRejectedValue(new Error("Network error"));
    mockFetchHostPlots.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useHostDashboard("host-id"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.stats).toBeNull();
  });

  it("returns 'Not signed in' error when hostId is undefined", async () => {
    const { result } = renderHook(() => useHostDashboard(undefined));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Not signed in");
    expect(mockFetchHostStats).not.toHaveBeenCalled();
    expect(mockFetchHostPlots).not.toHaveBeenCalled();
  });

  it("refresh() re-fetches data", async () => {
    mockFetchHostStats.mockResolvedValue(ZERO_STATS);
    mockFetchHostPlots.mockResolvedValue([]);

    const { result } = renderHook(() => useHostDashboard("host-id"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Update mocks for refresh
    const updatedStats: HostStats = {
      monthly_earnings: 45,
      earnings_trend: 0,
      active_plots: 1,
      occupancy_rate: 100,
    };
    mockFetchHostStats.mockResolvedValue(updatedStats);
    mockFetchHostPlots.mockResolvedValue([MOCK_PLOT]);

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.stats).toEqual(updatedStats);
    expect(result.current.plots).toHaveLength(1);
    expect(mockFetchHostStats).toHaveBeenCalledTimes(2);
  });

  it("handles non-Error throws with fallback message", async () => {
    mockFetchHostStats.mockRejectedValue("string error");
    mockFetchHostPlots.mockRejectedValue("string error");

    const { result } = renderHook(() => useHostDashboard("host-id"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Failed to load dashboard");
  });
});
