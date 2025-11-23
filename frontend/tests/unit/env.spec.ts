import { describe, expect, it } from 'vitest';
import { env } from '@/config/env';

describe('env config', () => {
  it('exposes the public API URL', () => {
    expect(env.NEXT_PUBLIC_API_URL).toMatch(/^http/);
  });
});
