/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SCSS support
  sassOptions: {
    includePaths: ['./styles'],
    prependData: `@import "variables.scss"; @import "mixins.scss";`,
  },
  
  // Experimental features
  experimental: {
    serverActions: true,
  },

  // Image configuration
  images: {
    domains: [],
  },

  // Environment variables available to the browser
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

module.exports = nextConfig;