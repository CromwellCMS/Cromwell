module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js$/,
      use: [
        {
          loader: require('path').resolve(__dirname, 'suppress-hydration-loader.js'),
        },
      ],
    });

    return config;
  },
};
