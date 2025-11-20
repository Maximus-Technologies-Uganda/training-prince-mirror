import React from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddExpenseDrawer } from '../../frontend/app/expenses/components/AddExpenseDrawer';

const { mutateAsync, mockState, emitValidationTelemetry } = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  mockState: { isPending: false, error: null as Error | null },
  emitValidationTelemetry: vi.fn(),
}));

const getAmountInput = () => screen.getByLabelText(/^Amount/i);
const getCategorySelect = () => screen.getByLabelText(/^Category/i);
const getDateInput = () => screen.getByLabelText(/^Date/i);
const getAlertByText = (text: string | RegExp) => screen.getByText(text, { selector: 'span[role="alert"]' });
const findAlertByText = (text: string | RegExp) => screen.findByText(text, { selector: 'span[role="alert"]' });

vi.mock('../../frontend/app/expenses/hooks/useCreateExpenseMutation', () => ({
  useCreateExpenseMutation: () => ({
    mutateAsync,
    isPending: mockState.isPending,
    error: mockState.error,
  }),
}));

vi.mock('../../frontend/app/expenses/utils/trackRefresh', () => ({
  emitValidationTelemetry,
}));

describe('Add expense drawer contract', () => {
  beforeEach(() => {
    mutateAsync.mockReset();
    mutateAsync.mockResolvedValue({});
    mockState.isPending = false;
    mockState.error = null;
    emitValidationTelemetry.mockReset();
  });

  it('submits a valid payload, keeps drawer open, and notifies success handler', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<AddExpenseDrawer isOpen onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.type(getAmountInput(), '45.60');
    await user.selectOptions(getCategorySelect(), 'travel');
    await user.type(getDateInput(), '2025-11-18');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mutateAsync).toHaveBeenCalledWith({ amount: 45.6, category: 'travel', date: '2025-11-18' });
    expect(await screen.findByText(/Expense added/)).toBeVisible();
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(emitValidationTelemetry).not.toHaveBeenCalled();
  });

  it('blocks submission when amount is missing and logs telemetry', async () => {
    const user = userEvent.setup();
    render(<AddExpenseDrawer isOpen onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Amount must be greater than 0')).toBeVisible();
    expect(mutateAsync).not.toHaveBeenCalled();
  expect(emitValidationTelemetry).toHaveBeenCalledWith(['amount', 'category', 'date']);
  });

  it('shows validation when category missing', async () => {
    const user = userEvent.setup();
    render(<AddExpenseDrawer isOpen onClose={vi.fn()} />);

      await user.type(getAmountInput(), '10');
      await user.type(getDateInput(), '2025-11-18');
      await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(getAlertByText('Select a category')).toBeVisible();
    expect(emitValidationTelemetry).toHaveBeenCalledWith(['category']);
  });

  it('shows validation when date is missing', async () => {
    const user = userEvent.setup();
    render(<AddExpenseDrawer isOpen onClose={vi.fn()} />);

    await user.type(getAmountInput(), '10');
    await user.selectOptions(getCategorySelect(), 'food');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Date is required')).toBeVisible();
    expect(emitValidationTelemetry).toHaveBeenCalledWith(['date']);
  });

  it('shows validation when date is in future', async () => {
    const user = userEvent.setup();
    render(<AddExpenseDrawer isOpen onClose={vi.fn()} />);

    await user.type(getAmountInput(), '10');
    await user.selectOptions(getCategorySelect(), 'food');
    await user.type(getDateInput(), '2999-01-01');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Date cannot be in the future')).toBeVisible();
    expect(emitValidationTelemetry).toHaveBeenCalledWith(['date']);
  });

  it('maps API field errors, focuses first errored field, and emits telemetry', async () => {
    const user = userEvent.setup();
    mutateAsync.mockRejectedValueOnce({
      details: [{ field: 'category', message: 'Category is invalid' }],
    });
    render(<AddExpenseDrawer isOpen onClose={vi.fn()} />);

  await user.type(getAmountInput(), '12');
  await user.selectOptions(getCategorySelect(), 'travel');
  await user.type(getDateInput(), '2025-11-18');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(await findAlertByText('Category is invalid')).toBeVisible();
    expect(document.activeElement).toBe(getCategorySelect());
    expect(emitValidationTelemetry).toHaveBeenCalledWith(['category']);
  });

  it('disables submit button while pending', async () => {
    mockState.isPending = true;
    render(<AddExpenseDrawer isOpen onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Submitting/ })).toBeDisabled();
  });

  it('surfaces retry control for server failures and replays payload', async () => {
    const user = userEvent.setup();
    mutateAsync.mockRejectedValueOnce(new Error('Network down'));
    const { rerender } = render(<AddExpenseDrawer isOpen onClose={vi.fn()} />);

    await user.type(getAmountInput(), '30');
    await user.selectOptions(getCategorySelect(), 'travel');
    await user.type(getDateInput(), '2025-11-18');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    mockState.error = new Error('Failed to save expense');
    rerender(<AddExpenseDrawer isOpen onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(mutateAsync).toHaveBeenCalledTimes(2);
    expect(mutateAsync).toHaveBeenLastCalledWith({ amount: 30, category: 'travel', date: '2025-11-18' });
  });
});
