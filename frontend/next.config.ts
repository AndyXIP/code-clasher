import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    // Add Monaco Editor worker support
    if (!isServer) {
      config.resolve.alias['monaco-editor'] = 'monaco-editor/esm/vs/editor/editor.main.js';
    }

    return config;
  },
};

export default nextConfig;
