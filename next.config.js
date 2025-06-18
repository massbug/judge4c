const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 使用新的 Turbopack 配置
  turbopack: {
    // 在这里添加 Turbopack 的配置选项
  },
}

module.exports = withNextIntl(nextConfig); 