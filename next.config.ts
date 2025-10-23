/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SCSS support
  sassOptions: {
    includePaths: ["./styles"],
    prependData: `@use "@/styles/variables" as *; @use "@/styles/mixins" as *;`,
  },

  // Experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
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
