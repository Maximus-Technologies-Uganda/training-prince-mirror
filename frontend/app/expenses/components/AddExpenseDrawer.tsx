"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import classNames from "classnames";
import { useCreateExpenseMutation, type CreateExpenseInput } from "@/hooks/useCreateExpenseMutation";
import { emitValidationTelemetry } from "@/utils/trackRefresh";

interface AddExpenseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

type FormErrors = Partial<Record<"amount" | "category" | "date", string>>;
type FormState = { amount: string; category: string; date: string };

const EMPTY_FORM: FormState = { amount: "", category: "", date: "" };
const FIVE_MINUTES = 5 * 60 * 1000;
const SLOW_SUBMISSION_THRESHOLD = 10_000;

export function AddExpenseDrawer({ isOpen, onClose, onSuccess, onDirtyChange }: AddExpenseDrawerProps) {
  const { mutateAsync, isPending, error } = useCreateExpenseMutation();
  const [formValues, setFormValues] = useState<FormState>({ ...EMPTY_FORM });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [showRefreshHint, setShowRefreshHint] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const categoryFieldRef = useRef<HTMLSelectElement | null>(null);
  const dateFieldRef = useRef<HTMLInputElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const slowSubmissionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubmittedPayload = useRef<CreateExpenseInput | null>(null);

  const isDirty = useMemo(
    () => Boolean(formValues.amount || formValues.category || formValues.date),
    [formValues],
  );

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!isOpen) {
      setFormErrors({});
      setIsTakingLong(false);
      setShowRefreshHint(false);
      return;
    }
    setFormValues({ ...EMPTY_FORM });
    setFormErrors({});
    setSuccessMessage(null);
    setShowRefreshHint(false);
    lastSubmittedPayload.current = null;
    setTimeout(() => firstFieldRef.current?.focus(), 0);
    refreshHintTimerRef.current = setTimeout(() => setShowRefreshHint(true), FIVE_MINUTES);
    return () => {
      if (refreshHintTimerRef.current) {
        clearTimeout(refreshHintTimerRef.current);
        refreshHintTimerRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isPending) {
      setIsTakingLong(false);
      if (slowSubmissionTimerRef.current) {
        clearTimeout(slowSubmissionTimerRef.current);
        slowSubmissionTimerRef.current = null;
      }
      return;
    }
    slowSubmissionTimerRef.current = setTimeout(() => setIsTakingLong(true), SLOW_SUBMISSION_THRESHOLD);
    return () => {
      if (slowSubmissionTimerRef.current) {
        clearTimeout(slowSubmissionTimerRef.current);
        slowSubmissionTimerRef.current = null;
      }
    };
  }, [isPending]);

  useEffect(() => {
    if (!successMessage) {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
      return;
    }
    successTimerRef.current = setTimeout(() => setSuccessMessage(null), 4_000);
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, [successMessage]);

  useEffect(() => {
    return () => {
      if (refreshHintTimerRef.current) clearTimeout(refreshHintTimerRef.current);
      if (slowSubmissionTimerRef.current) clearTimeout(slowSubmissionTimerRef.current);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const focusField = useCallback((field: keyof FormErrors) => {
    const refMap = {
      amount: firstFieldRef,
      category: categoryFieldRef,
      date: dateFieldRef,
    } as const;
    const target = refMap[field]?.current;
    if (target) target.focus();
  }, []);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Tab") {
        trapFocus(event);
      }
    }

    function trapFocus(event: KeyboardEvent) {
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, onClose]);

  const drawerClass = classNames("drawer", { "drawer--open": isOpen });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors: FormErrors = {};
    if (!formValues.amount || Number(formValues.amount) <= 0) {
      errors.amount = "Amount must be greater than 0";
    }
    if (!formValues.category) {
      errors.category = "Select a category";
    }
    if (!formValues.date) {
      errors.date = "Date is required";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (formValues.date > today) {
        errors.date = "Date cannot be in the future";
      }
    }
    setFormErrors(errors);
    const errorFields = getErrorFields(errors);
    if (errorFields.length > 0) {
      focusField(errorFields[0]);
      emitValidationTelemetry(errorFields.map(String));
      return;
    }

    const payload: CreateExpenseInput = {
      amount: Number(formValues.amount),
      category: formValues.category,
      date: formValues.date,
    };
    lastSubmittedPayload.current = payload;

    try {
      await mutateAsync(payload);
      setSuccessMessage("Expense added");
      setFormValues({ ...EMPTY_FORM });
      setFormErrors({});
      onSuccess?.();
    } catch (mutationError) {
      const serverErrors = mapServerErrors(mutationError);
      setFormErrors(serverErrors);
      const serverFields = getErrorFields(serverErrors);
      if (serverFields.length > 0) {
        focusField(serverFields[0]);
        emitValidationTelemetry(serverFields.map(String));
      }
    }
  };

  const retryLastSubmission = async () => {
    if (!lastSubmittedPayload.current || isPending) return;
    setFormErrors({});
    try {
      await mutateAsync(lastSubmittedPayload.current);
      setSuccessMessage("Expense added");
      setFormValues({ ...EMPTY_FORM });
      setFormErrors({});
      onSuccess?.();
    } catch (mutationError) {
      const serverErrors = mapServerErrors(mutationError);
      setFormErrors(serverErrors);
      const serverFields = getErrorFields(serverErrors);
      if (serverFields.length > 0) {
        focusField(serverFields[0]);
        emitValidationTelemetry(serverFields.map(String));
      }
    }
  };

  const handleAmountChange = (value: string) => {
    setFormValues((prev) => ({ ...prev, amount: value }));
    setFormErrors((prev) => ({ ...prev, amount: undefined }));
    setSuccessMessage(null);
  };

  const handleCategoryChange = (value: string) => {
    setFormValues((prev) => ({ ...prev, category: value }));
    setFormErrors((prev) => ({ ...prev, category: undefined }));
    setSuccessMessage(null);
  };

  const handleDateChange = (value: string) => {
    setFormValues((prev) => ({ ...prev, date: value }));
    setFormErrors((prev) => ({ ...prev, date: undefined }));
    setSuccessMessage(null);
  };

  const hasFieldErrors = Object.values(formErrors).some(Boolean);

  return (
    <div
      ref={drawerRef}
      className={drawerClass}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-expense-title"
      aria-describedby="add-expense-description"
    >
      <header className="drawer-header">
        <div>
          <p className="muted">POST /expenses</p>
          <h2 id="add-expense-title">Add expense</h2>
          <p id="add-expense-description" className="muted">
            All fields are required. Inline errors announce automatically for screen readers.
          </p>
        </div>
        <button className="btn ghost" onClick={onClose} aria-label="Close drawer" type="button">
          ×
        </button>
      </header>
      <form className="drawer-form" onSubmit={submit} noValidate>
        <Field label="Amount" error={formErrors.amount} helper="Enter a positive amount">
          <input
            ref={firstFieldRef}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            name="amount"
            placeholder="0.00"
            value={formValues.amount}
            onChange={(event) => handleAmountChange(event.target.value)}
          />
        </Field>
        <Field label="Category" error={formErrors.category} helper="Choose a category">
          <select
            ref={categoryFieldRef}
            name="category"
            value={formValues.category}
            onChange={(event) => handleCategoryChange(event.target.value)}
          >
            <option value="">Select a category</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="office">Office</option>
            <option value="supplies">Supplies</option>
          </select>
        </Field>
        <Field label="Date" error={formErrors.date} helper="Dates can’t be in the future">
          <input
            ref={dateFieldRef}
            type="date"
            max={new Date().toISOString().split("T")[0]}
            name="date"
            value={formValues.date}
            onChange={(event) => handleDateChange(event.target.value)}
          />
        </Field>
        {successMessage && (
          <p role="status" className="success">
            ✅ {successMessage}
          </p>
        )}
        {error && !hasFieldErrors && (
          <div className="alert error" role="alert">
            <p className="alert-body">Failed to save expense. Please try again.</p>
            <div className="alert-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={retryLastSubmission}
                disabled={!lastSubmittedPayload.current || isPending}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        <button type="submit" className="btn primary" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit"}
        </button>
        {isTakingLong && (
          <p className="muted" role="status">
            Still working… keep this tab open while we finish.
          </p>
        )}
        {showRefreshHint && (
          <p className="muted" data-testid="drawer-refresh-hint">
            Been a while? Refresh the dashboard before logging more expenses.
          </p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  helper,
  children,
}: {
  label: string;
  error?: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {helper && <span className="muted">{helper}</span>}
      {error && (
        <span role="alert" aria-live="assertive" className="error-text">
          {error}
        </span>
      )}
    </label>
  );
}

function getErrorFields(errors: FormErrors) {
  return (Object.keys(errors) as Array<keyof FormErrors>).filter((key) => Boolean(errors[key]));
}

function mapServerErrors(error: unknown): FormErrors {
  const formatted: FormErrors = {};
  if (error && typeof error === "object" && "details" in error) {
    const details = (error as { details?: Array<{ field: string; message: string }> }).details;
    details?.forEach((detail) => {
      if (detail.field === "amount") formatted.amount = detail.message;
      if (detail.field === "category") formatted.category = detail.message;
      if (detail.field === "date") formatted.date = detail.message;
    });
  }
  return formatted;
}
