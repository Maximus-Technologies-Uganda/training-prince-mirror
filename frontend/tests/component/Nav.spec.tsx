import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Nav } from '@/app/(shell)/Nav';

// Mock next/navigation
const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

describe('app/(shell)/Nav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation with logo', () => {
    mockUsePathname.mockReturnValue('/');

    render(<Nav />);

    expect(screen.getByText('Day 2 Ledger')).toBeInTheDocument();
  });

  it('renders Expenses link', () => {
    mockUsePathname.mockReturnValue('/');

    render(<Nav />);

    const link = screen.getByRole('link', { name: 'Expenses' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/expenses');
  });

  it('marks Expenses link as active when on /expenses', () => {
    mockUsePathname.mockReturnValue('/expenses');

    render(<Nav />);

    const link = screen.getByRole('link', { name: 'Expenses' });
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('marks Expenses link as active when on /expenses subroute', () => {
    mockUsePathname.mockReturnValue('/expenses/details/123');

    render(<Nav />);

    const link = screen.getByRole('link', { name: 'Expenses' });
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark link as active on different route', () => {
    mockUsePathname.mockReturnValue('/other');

    render(<Nav />);

    const link = screen.getByRole('link', { name: 'Expenses' });
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('has correct aria-label for navigation', () => {
    mockUsePathname.mockReturnValue('/');

    render(<Nav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Primary');
  });

  it('handles null pathname gracefully', () => {
    mockUsePathname.mockReturnValue(null);

    expect(() => render(<Nav />)).not.toThrow();
  });
});
