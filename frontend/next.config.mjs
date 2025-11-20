const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  eslint: {
    dirs: ['app', 'tests', 'src'],
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
