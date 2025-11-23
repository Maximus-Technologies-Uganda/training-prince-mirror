import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createExpensesTelemetry } from '@/lib/observability/expenses-telemetry';

describe('lib/observability/expenses-telemetry', () => {
  let mockWindow: any;
  let eventListener: (event: CustomEvent) => void;
  let capturedEvents: any[] = [];

  beforeEach(() => {
    capturedEvents = [];
    eventListener = (event: CustomEvent) => {
      capturedEvents.push(event.detail);
    };

    // Mock window with event dispatching
    mockWindow = {
      dispatchEvent: vi.fn((event: CustomEvent) => {
        eventListener(event);
        return true;
      }),
    };
    vi.stubGlobal('window', mockWindow);

    // Spy on console.info for dev logging
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createExpensesTelemetry', () => {
    it('creates telemetry instance with default source', () => {
      const telemetry = createExpensesTelemetry();
      const correlationId = telemetry.getCorrelationId();

      expect(correlationId).toMatch(/^expenses-page-/);
    });

    it('creates telemetry instance with custom source', () => {
      const telemetry = createExpensesTelemetry('custom-component');
      const correlationId = telemetry.getCorrelationId();

      expect(correlationId).toMatch(/^custom-component-/);
    });

    it('generates unique correlation IDs', () => {
      const telemetry1 = createExpensesTelemetry();
      const telemetry2 = createExpensesTelemetry();

      expect(telemetry1.getCorrelationId()).not.toBe(telemetry2.getCorrelationId());
    });
  });

  describe('recordStatus', () => {
    it('publishes status event with loading state', () => {
      const telemetry = createExpensesTelemetry('test-source');
      telemetry.recordStatus('loading');

      expect(capturedEvents).toHaveLength(1);
      expect(capturedEvents[0]).toMatchObject({
        type: 'status',
        status: 'loading',
        source: 'test-source',
      });
      expect(capturedEvents[0].correlationId).toBeTruthy();
      expect(capturedEvents[0].timestamp).toBeTypeOf('number');
    });

    it('publishes status event with empty state', () => {
      const telemetry = createExpensesTelemetry();
      telemetry.recordStatus('empty');

      expect(capturedEvents[0].status).toBe('empty');
    });

    it('publishes status event with success state', () => {
      const telemetry = createExpensesTelemetry();
      telemetry.recordStatus('success');

      expect(capturedEvents[0].status).toBe('success');
    });

    it('includes metadata when provided', () => {
      const telemetry = createExpensesTelemetry();
      const meta = { count: 5, duration: 120 };

      telemetry.recordStatus('success', meta);

      expect(capturedEvents[0].meta).toEqual(meta);
    });

    it('deduplicates consecutive identical status events', () => {
      const telemetry = createExpensesTelemetry();

      telemetry.recordStatus('loading');
      telemetry.recordStatus('loading');
      telemetry.recordStatus('loading');

      expect(capturedEvents).toHaveLength(1);
    });

    it('publishes when status changes', () => {
      const telemetry = createExpensesTelemetry();

      telemetry.recordStatus('loading');
      telemetry.recordStatus('success');
      telemetry.recordStatus('loading');

      expect(capturedEvents).toHaveLength(3);
      expect(capturedEvents.map((e) => e.status)).toEqual(['loading', 'success', 'loading']);
    });

    it('dispatches custom event on window', () => {
      const telemetry = createExpensesTelemetry();
      telemetry.recordStatus('loading');

      expect(mockWindow.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'expenses:telemetry',
        })
      );
    });
  });

  describe('recordError', () => {
    it('publishes error event', () => {
      const telemetry = createExpensesTelemetry('error-test');
      const error = new Error('Test error message');

      telemetry.recordError(error);

      expect(capturedEvents).toHaveLength(1);
      expect(capturedEvents[0]).toMatchObject({
        type: 'error',
        message: 'Test error message',
        source: 'error-test',
      });
      expect(capturedEvents[0].correlationId).toBeTruthy();
      expect(capturedEvents[0].timestamp).toBeTypeOf('number');
    });

    it('handles multiple error events', () => {
      const telemetry = createExpensesTelemetry();

      telemetry.recordError(new Error('First error'));
      telemetry.recordError(new Error('Second error'));

      expect(capturedEvents).toHaveLength(2);
      expect(capturedEvents[0].message).toBe('First error');
      expect(capturedEvents[1].message).toBe('Second error');
    });
  });

  describe('recordRetry', () => {
    it('publishes retry event with attempt number', () => {
      const telemetry = createExpensesTelemetry('retry-test');

      telemetry.recordRetry(1);

      expect(capturedEvents).toHaveLength(1);
      expect(capturedEvents[0]).toMatchObject({
        type: 'retry',
        attempt: 1,
        source: 'retry-test',
      });
      expect(capturedEvents[0].correlationId).toBeTruthy();
      expect(capturedEvents[0].timestamp).toBeTypeOf('number');
    });

    it('tracks multiple retry attempts', () => {
      const telemetry = createExpensesTelemetry();

      telemetry.recordRetry(1);
      telemetry.recordRetry(2);
      telemetry.recordRetry(3);

      expect(capturedEvents).toHaveLength(3);
      expect(capturedEvents.map((e) => e.attempt)).toEqual([1, 2, 3]);
    });
  });

  describe('recordManualRefresh', () => {
    it('publishes manual-refresh event', () => {
      const telemetry = createExpensesTelemetry('refresh-test');

      telemetry.recordManualRefresh();

      expect(capturedEvents).toHaveLength(1);
      expect(capturedEvents[0]).toMatchObject({
        type: 'manual-refresh',
        source: 'refresh-test',
      });
      expect(capturedEvents[0].correlationId).toBeTruthy();
      expect(capturedEvents[0].timestamp).toBeTypeOf('number');
    });

    it('allows multiple refresh events', () => {
      const telemetry = createExpensesTelemetry();

      telemetry.recordManualRefresh();
      telemetry.recordManualRefresh();

      expect(capturedEvents).toHaveLength(2);
    });
  });

  describe('correlation ID persistence', () => {
    it('maintains same correlation ID across all events', () => {
      const telemetry = createExpensesTelemetry();
      const correlationId = telemetry.getCorrelationId();

      telemetry.recordStatus('loading');
      telemetry.recordError(new Error('Test'));
      telemetry.recordRetry(1);
      telemetry.recordManualRefresh();

      expect(capturedEvents).toHaveLength(4);
      capturedEvents.forEach((event) => {
        expect(event.correlationId).toBe(correlationId);
      });
    });
  });

  describe('dev environment logging', () => {
    it('logs to console in non-production', () => {
      const telemetry = createExpensesTelemetry();
      telemetry.recordStatus('loading');

      // In test environment (not production), console.info should be called
      expect(console.info).toHaveBeenCalledWith(
        '[expenses:telemetry]',
        expect.objectContaining({
          type: 'status',
          status: 'loading',
        })
      );
    });
  });

  describe('browser environment handling', () => {
    it('handles missing window gracefully', () => {
      vi.stubGlobal('window', undefined);

      const telemetry = createExpensesTelemetry();

      // Should not throw
      expect(() => telemetry.recordStatus('loading')).not.toThrow();
      expect(() => telemetry.recordError(new Error('Test'))).not.toThrow();
      expect(() => telemetry.recordRetry(1)).not.toThrow();
      expect(() => telemetry.recordManualRefresh()).not.toThrow();
    });

    it('handles window without dispatchEvent', () => {
      vi.stubGlobal('window', {});

      const telemetry = createExpensesTelemetry();

      // Should not throw
      expect(() => telemetry.recordStatus('loading')).not.toThrow();
    });
  });
});
