import { fetchHostPlots, fetchHostStats } from "@/services/hostService";
import {
  supabase,
  __setNextResult,
  __setResultQueue,
  __resetMock,
} from "@/lib/supabase";

jest.mock("@/lib/supabase");

const MOCK_PLOT_ROW = {
  id: "plot-001",
  host_id: "host-abc",
  title: "Sunny Garden Plot",
  description: "A lovely plot with morning sun",
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
  __resetMock();
});

describe("fetchHostPlots", () => {
  it("returns empty array for a new host with no plots", async () => {
    __setNextResult({ data: [], error: null });

    const result = await fetchHostPlots("new-host-id");

    expect(result).toEqual([]);
    expect(supabase.from).toHaveBeenCalledWith("plots");
  });

  it("returns plots for host with existing plots", async () => {
    const secondPlot = { ...MOCK_PLOT_ROW, id: "plot-002", title: "Shady Plot" };
    __setNextResult({ data: [MOCK_PLOT_ROW, secondPlot], error: null });

    const result = await fetchHostPlots("host-abc");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("plot-001");
    expect(result[1].id).toBe("plot-002");
  });

  it("returns empty array when data is null", async () => {
    __setNextResult({ data: null, error: null });

    const result = await fetchHostPlots("host-id");

    expect(result).toEqual([]);
  });

  it("throws on Supabase error", async () => {
    __setNextResult({
      data: null,
      error: { message: "connection timeout" },
    });

    await expect(fetchHostPlots("host-id")).rejects.toMatchObject({
      message: "connection timeout",
    });
  });
});

describe("fetchHostStats", () => {
  it("returns zeroed stats for a new host with no plots", async () => {
    __setNextResult({ data: [], error: null });

    const result = await fetchHostStats("new-host-id");

    expect(result).toEqual({
      monthly_earnings: 0,
      earnings_trend: 0,
      active_plots: 0,
      occupancy_rate: 0,
    });
    // Only the plots query should fire — bookings query is skipped
    expect(supabase.from).toHaveBeenCalledTimes(1);
    expect(supabase.from).toHaveBeenCalledWith("plots");
  });

  it("returns correct stats when host has active plots with bookings", async () => {
    __setResultQueue([
      // 1st call: plots query
      {
        data: [
          { id: "plot-1", is_active: true },
          { id: "plot-2", is_active: true },
        ],
        error: null,
      },
      // 2nd call: bookings query
      {
        data: [
          { monthly_price: 45, status: "active" },
          { monthly_price: 30, status: "confirmed" },
        ],
        error: null,
      },
    ]);

    const result = await fetchHostStats("host-with-plots");

    expect(result.monthly_earnings).toBe(75);
    expect(result.active_plots).toBe(2);
    expect(result.earnings_trend).toBe(0); // TODO in source — always 0
    // Note: occupancy uses array index instead of plot_id (known bug in hostService.ts:68-72).
    // With 1 "active" booking, occupiedPlots=1, so occupancy = round(1/2 * 100) = 50
    expect(result.occupancy_rate).toBe(50);
  });

  it("handles mix of active and inactive plots", async () => {
    __setResultQueue([
      {
        data: [
          { id: "p1", is_active: true },
          { id: "p2", is_active: false },
          { id: "p3", is_active: true },
        ],
        error: null,
      },
      {
        data: [{ monthly_price: 50, status: "active" }],
        error: null,
      },
    ]);

    const result = await fetchHostStats("host-id");

    expect(result.active_plots).toBe(2);
    expect(result.monthly_earnings).toBe(50);
    expect(result.occupancy_rate).toBe(50);
  });

  it("throws on plots query error", async () => {
    __setNextResult({
      data: null,
      error: { message: "plots query failed" },
    });

    await expect(fetchHostStats("host-id")).rejects.toMatchObject({
      message: "plots query failed",
    });
  });

  it("throws on bookings query error", async () => {
    __setResultQueue([
      {
        data: [{ id: "p1", is_active: true }],
        error: null,
      },
      {
        data: null,
        error: { message: "bookings query failed" },
      },
    ]);

    await expect(fetchHostStats("host-id")).rejects.toMatchObject({
      message: "bookings query failed",
    });
  });
});
