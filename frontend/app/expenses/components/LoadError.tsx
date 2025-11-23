"use client";

import React, { useState } from "react";

interface LoadErrorProps {
  message?: string;
  supportCode?: string;
  retryCount?: number;
  onRetry: () => Promise<void> | void;
}

export function LoadError({
  message = "We hit a snag while fetching the expenses ledger.",
  supportCode,
  retryCount = 0,
  onRetry,
}: LoadErrorProps) {
  const [isRetrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (isRetrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="load-error" role="alert" aria-live="assertive" data-testid="load-error">
      <h3>We can’t reach the ledger right now</h3>
      <p className="muted">{message}</p>
      {supportCode ? (
        <p className="muted load-error__support">
          Support code: <code>{supportCode}</code>
        </p>
      ) : null}
      <div className="load-error__meta" aria-live="polite">
        <span aria-label="Number of retry attempts so far">
          Retries attempted: {retryCount}
        </span>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRetry}
          disabled={isRetrying}
        >
          {isRetrying ? "Retrying…" : "Retry fetch"}
        </button>
      </div>
    </div>
  );
}
