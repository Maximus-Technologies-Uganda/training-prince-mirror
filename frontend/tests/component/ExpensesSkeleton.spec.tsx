import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExpensesSkeleton } from "@/components/ExpensesSkeleton";
import { LoadError } from "@/components/LoadError";

describe("Expenses skeleton and error transitions", () => {
  it("announces loading state via aria attributes", () => {
    render(<ExpensesSkeleton label="Loading ledger for reviewers" />);

    const skeleton = screen.getByTestId("expenses-skeleton");
    expect(skeleton).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText(/loading ledger for reviewers/i)).toBeInTheDocument();
  });

  it("invokes retry handler and disables the button while awaiting", async () => {
    const retrySpy = vi.fn().mockResolvedValue(undefined);

    render(
      <LoadError
        message="Upstream timeout"
        supportCode="corr-test"
        retryCount={2}
        onRetry={retrySpy}
      />,
    );

    const button = screen.getByRole("button", { name: /retry fetch/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => expect(retrySpy).toHaveBeenCalledTimes(1));
  });
});
