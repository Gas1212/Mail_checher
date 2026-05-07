/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
  // Required for @imgly/background-removal WASM bundle
  webpack: (config, { isServer }) => {
    // Don't bundle WASM-based packages on the server
    if (isServer) {
      config.externals = [...(config.externals || []), '@imgly/background-removal']
    }
    // Enable WASM support
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    return config
  },
}

module.exports = nextConfig
