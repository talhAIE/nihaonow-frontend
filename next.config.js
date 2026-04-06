/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/.next/**",
        "**/node_modules/**",
        "**/.git/**",
        "**/.npm-cache/**",
        "**/coverage/**",
        "**/dist/**",
      ],
    };
    return config;
  },
};

module.exports = nextConfig;
