/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  useFileSystemPublicRoutes: false,
  async rewrites() {
    return [
      // Rewrite everything else to `pages/index`
      {
        source: "/:path*",
        destination: "/",
      }
    ];
  },
}

module.exports = nextConfig
