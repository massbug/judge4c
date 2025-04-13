import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["dockerode"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);