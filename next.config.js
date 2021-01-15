module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty',
      };
      require('./scripts/sitemap-generator');
    }
    return config;
  },
};
