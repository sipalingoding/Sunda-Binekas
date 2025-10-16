import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export default nextConfig;
