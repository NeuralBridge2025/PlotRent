import { createPlot } from "@/services/plotService";
import {
  supabase,
  __setNextResult,
  __resetMock,
} from "@/lib/supabase";

jest.mock("@/lib/supabase");

const FULL_PLOT_PAYLOAD = {
  host_id: "user-abc-123",
  title: "The Sunny Terrace Plot",
  description: "A beautiful south-facing terrace",
  price_per_month: 45,
  size_sqm: 25,
  latitude: 38.7223,
  longitude: -9.1393,
  address: "Rua da Horta 10",
  city: "Lisbon",
  country: "Portugal",
  soil_type: "Loamy",
  sun_exposure: "Full Sun",
  utilities: ["Water Access", "Toolshed"],
  images: ["https://storage.example.com/img1.jpg"],
  instant_book: true,
};

const FULL_PLOT_ROW = {
  id: "plot-xyz-789",
  ...FULL_PLOT_PAYLOAD,
  tags: null,
  rating: null,
  review_count: 0,
  is_active: true,
  created_at: "2026-04-05T10:00:00Z",
  updated_at: "2026-04-05T10:00:00Z",
};

afterEach(() => {
  __resetMock();
});

describe("createPlot", () => {
  it("creates a plot with all fields and returns the inserted row", async () => {
    __setNextResult({ data: FULL_PLOT_ROW, error: null });

    const result = await createPlot(FULL_PLOT_PAYLOAD);

    expect(result).toEqual(FULL_PLOT_ROW);
    expect(supabase.from).toHaveBeenCalledWith("plots");
  });

  it("creates a plot with only required fields", async () => {
    const minimalPayload = {
      host_id: "user-abc-123",
      title: "Basic Plot",
      price_per_month: 30,
      size_sqm: 15,
      latitude: 38.7223,
      longitude: -9.1393,
      address: "Rua Nova 5",
      city: "Porto",
      country: "Portugal",
      images: [],
    };

    const expectedRow = {
      id: "plot-minimal-001",
      ...minimalPayload,
      description: null,
      soil_type: null,
      sun_exposure: null,
      utilities: null,
      tags: null,
      rating: null,
      review_count: 0,
      is_active: true,
      instant_book: false,
      created_at: "2026-04-05T11:00:00Z",
      updated_at: "2026-04-05T11:00:00Z",
    };

    __setNextResult({ data: expectedRow, error: null });

    const result = await createPlot(minimalPayload);

    expect(result.title).toBe("Basic Plot");
    expect(result.description).toBeNull();
    expect(result.soil_type).toBeNull();
    expect(result.sun_exposure).toBeNull();
    expect(result.utilities).toBeNull();
    expect(result.instant_book).toBe(false);
  });

  it("throws when Supabase returns an error", async () => {
    __setNextResult({
      data: null,
      error: { message: "duplicate key", code: "23505" },
    });

    await expect(createPlot(FULL_PLOT_PAYLOAD)).rejects.toMatchObject({
      message: "duplicate key",
    });
  });
});
