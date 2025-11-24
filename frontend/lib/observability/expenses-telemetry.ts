export type ExpensesTelemetryStatus = "loading" | "empty" | "success";

type EventMeta = Record<string, unknown> | undefined;

type ExpensesTelemetryEvent =
  | {
      type: "status";
      status: ExpensesTelemetryStatus;
      meta?: EventMeta;
      source: string;
      timestamp: number;
      correlationId: string;
    }
  | {
      type: "error";
      message: string;
      source: string;
      timestamp: number;
      correlationId: string;
    }
  | {
      type: "retry";
      attempt: number;
      source: string;
      timestamp: number;
      correlationId: string;
    }
  | {
      type: "manual-refresh";
      source: string;
      timestamp: number;
      correlationId: string;
    };

const CHANNEL = "expenses:telemetry";

function publish(event: ExpensesTelemetryEvent) {
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new CustomEvent(CHANNEL, { detail: event }));
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console -- Intentional debug logging for telemetry tap
    console.info(`[${CHANNEL}]`, event);
  }
}

export interface ExpensesTelemetry {
  recordStatus: (status: ExpensesTelemetryStatus, meta?: EventMeta) => void;
  recordError: (error: Error) => void;
  recordRetry: (attempt: number) => void;
  recordManualRefresh: () => void;
  getCorrelationId: () => string;
}

export function createExpensesTelemetry(source = "expenses-page"): ExpensesTelemetry {
  const correlationId = `${source}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  let lastStatus: ExpensesTelemetryStatus | null = null;

  return {
    recordStatus(status, meta) {
      if (lastStatus === status) {
        return;
      }
      lastStatus = status;
      publish({ type: "status", status, meta, source, timestamp: Date.now(), correlationId });
    },
    recordError(error) {
      publish({ type: "error", message: error.message, source, timestamp: Date.now(), correlationId });
    },
    recordRetry(attempt) {
      publish({ type: "retry", attempt, source, timestamp: Date.now(), correlationId });
    },
    recordManualRefresh() {
      publish({ type: "manual-refresh", source, timestamp: Date.now(), correlationId });
    },
    getCorrelationId() {
      return correlationId;
    },
  };
}
