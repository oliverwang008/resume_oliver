/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the whole app can be hosted on S3 (no server needed).
  output: "export",
  // S3 static hosting has no image optimizer.
  images: { unoptimized: true },
  // Emit /path/index.html so S3 website hosting resolves clean URLs.
  trailingSlash: true,
};

export default nextConfig;
