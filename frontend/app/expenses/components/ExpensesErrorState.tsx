"use client";

interface ExpensesErrorStateProps {
  onRetry: () => void;
}

export function ExpensesErrorState({ onRetry }: ExpensesErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <h3>We couldn’t reach the proxy route</h3>
      <p className="muted">
        Check your <code>NEXT_SERVICE_TOKEN</code>, ensure the Chapter 5 API is reachable, then try again.
      </p>
      <button className="btn btn-primary" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
