/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io"]
  },
  
  // Add experimental features for better Edge Runtime compatibility
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
    esmExternals: "loose"
  },
  
  // Webpack configuration to handle middleware issues
  webpack: (config, { isServer, nextRuntime }) => {
    // Handle middleware compilation issues
    if (nextRuntime === "edge") {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Add any problematic modules here
      };
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET,
    NEXT_PUBLIC_LIVEKIT_URL: process.env.NEXT_PUBLIC_LIVEKIT_URL,
  }
};

export default nextConfig;