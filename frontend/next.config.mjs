const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    dirs: ['app', 'tests', 'src'],
  },
};

export default nextConfig;
