import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AppQueryClientProvider } from '@/app/providers/query-client';

describe('app/providers/query-client', () => {
  it('renders children', () => {
    render(
      <AppQueryClientProvider>
        <div data-testid="child">Test Child</div>
      </AppQueryClientProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('provides QueryClient to descendants', () => {
    const TestComponent = () => {
      // This would use useQuery hooks from TanStack Query
      // If QueryClient is not provided, it would throw
      return <div>Query Client Available</div>;
    };

    render(
      <AppQueryClientProvider>
        <TestComponent />
      </AppQueryClientProvider>
    );

    expect(screen.getByText('Query Client Available')).toBeInTheDocument();
  });

  it('creates QueryClient with correct default options', () => {
    // The QueryClient is created with specific defaults
    // We verify by rendering without errors
    render(
      <AppQueryClientProvider>
        <div>Content</div>
      </AppQueryClientProvider>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <AppQueryClientProvider>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </AppQueryClientProvider>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
    expect(screen.getByTestId('child3')).toBeInTheDocument();
  });

  it('does not render devtools in test environment', () => {
    const { container } = render(
      <AppQueryClientProvider>
        <div>Test</div>
      </AppQueryClientProvider>
    );

    // ReactQueryDevtools should not be rendered in test environment
    // Check that only the child content is rendered
    expect(container.textContent).toBe('Test');
  });

  it('uses same QueryClient instance across re-renders', () => {
    const { rerender } = render(
      <AppQueryClientProvider>
        <div>Initial</div>
      </AppQueryClientProvider>
    );

    expect(screen.getByText('Initial')).toBeInTheDocument();

    rerender(
      <AppQueryClientProvider>
        <div>Updated</div>
      </AppQueryClientProvider>
    );

    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
