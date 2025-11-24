import { beforeAll, describe, expect, it } from 'vitest';

describe('env config', () => {
  beforeAll(() => {
    // Ensure env vars are set before importing
    process.env.NEXT_PUBLIC_API_URL ||= 'http://127.0.0.1:3000';
    process.env.NEXT_SERVICE_TOKEN ||= 'test-token';
  });

  it('exposes the public API URL', async () => {
    const { env } = await import('@/config/env');
    expect(env.NEXT_PUBLIC_API_URL).toMatch(/^http/);
  });
});
