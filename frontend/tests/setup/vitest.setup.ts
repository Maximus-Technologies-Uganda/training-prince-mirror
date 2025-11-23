import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL ||= 'http://127.0.0.1:3000';
  process.env.NEXT_SERVICE_TOKEN ||= 'test-token';
});

afterEach(() => {
  cleanup();
});
