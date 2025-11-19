"use client";

import type { ExpenseFilters } from "@/models/summary";

type RefreshSource = "manual" | "auto" | "post-success";

type Pane = "list" | "summary" | "drawer";

interface TrackRefreshConfig {
  source: RefreshSource;
  pane?: Pane;
  filters?: ExpenseFilters;
}

export async function trackRefresh<T>(
  config: TrackRefreshConfig,
  refreshFn: () => Promise<T>,
): Promise<T> {
  const start = typeof performance !== "undefined" ? performance.now() : Date.now();
  try {
    const result = await refreshFn();
    emitTelemetryEvent({
      metric: "frontend.expenses.refresh_ms",
      durationMs: (typeof performance !== "undefined" ? performance.now() : Date.now()) - start,
      success: true,
      ...config,
    });
    return result;
  } catch (error) {
    emitTelemetryEvent({
      metric: "frontend.expenses.refresh_ms",
      durationMs: (typeof performance !== "undefined" ? performance.now() : Date.now()) - start,
      success: false,
      ...config,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export function emitFilterTelemetry(filters: ExpenseFilters) {
  emitTelemetryEvent({
    metric: "frontend.expenses.filters_changed",
    filters,
  });
}

export function emitValidationTelemetry(fields: string[]) {
  emitTelemetryEvent({
    metric: "frontend.expenses.validation_error",
    fields,
  });
}

interface TelemetryPayload {
  metric: string;
  durationMs?: number;
  success?: boolean;
  error?: string;
  source?: RefreshSource;
  pane?: Pane;
  filters?: ExpenseFilters;
  fields?: string[];
}

function emitTelemetryEvent(payload: TelemetryPayload) {
  const endpoint = process.env.NEXT_PUBLIC_TELEMETRY_REFRESH_ENDPOINT;
  if (!endpoint || typeof window === "undefined") return;

  const body = JSON.stringify({
    ...payload,
    timestamp: new Date().toISOString(),
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(endpoint, blob);
    return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch((error) => console.error("Failed to emit telemetry", error));
}
