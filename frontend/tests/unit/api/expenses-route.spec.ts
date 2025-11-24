import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/expenses/route";
import { requestChapter5 } from "@/lib/api/http";
import type { ExpenseDto } from "@/lib/api/expenses";

vi.mock("@/lib/api/http", () => ({
  requestChapter5: vi.fn(),
}));

const mockRequestChapter5 = vi.mocked(requestChapter5);

const sampleExpenses: ExpenseDto[] = [
  {
    id: "exp-1",
    merchant: "Figma",
    category: "Software",
    purchaseDate: "2025-11-20T12:00:00.000Z",
    status: "APPROVED",
    amount: { currency: "USD", value: 12500 },
  },
];

describe("GET /api/expenses", () => {
  it("returns Chapter 5 data on success", async () => {
    mockRequestChapter5.mockResolvedValue(sampleExpenses);

  const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(sampleExpenses);
    expect(mockRequestChapter5).toHaveBeenCalledWith("/expenses");
  });

  it("returns 204 when upstream returns no content", async () => {
    mockRequestChapter5.mockResolvedValue([]);

  const response = await GET();

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
  });

  it("maps upstream failures to 502", async () => {
    mockRequestChapter5.mockRejectedValue(new Error("Timeout"));

  const response = await GET();

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body).toEqual({ message: "Timeout" });
  });
});
