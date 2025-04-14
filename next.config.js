/** @type {import('next').NextConfig} */
const nextConfig = {
  // [https://github.com/open-telemetry/opentelemetry-js/issues/4297](https://github.com/open-telemetry/opentelemetry-js/issues/4297)
  experimental: {
    serverComponentsExternalPackages: [
      '@opentelemetry/auto-instrumentations-node',
      '@opentelemetry/sdk-node',
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;