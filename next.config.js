const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/marathon",
          has: [{ type: "host", value: "marathon.shashank.app" }],
        },
      ],
    };
  },
};
module.exports = nextConfig;
