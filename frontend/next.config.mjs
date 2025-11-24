import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const requiredEnv = ['NEXT_PUBLIC_API_URL', 'NEXT_SERVICE_TOKEN'];

const missing = requiredEnv.filter((name) => !process.env[name]);

if (missing.length) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}. ` +
      'Create frontend/.env.local (or export them in your shell) before running Next.js.',
  );
}

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  outputFileTracingRoot: path.join(__dirname, '..'),
  eslint: {
    dirs: ['app', 'config', 'lib', 'tests'],
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
