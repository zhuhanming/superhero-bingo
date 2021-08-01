/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

const packages = [path.join(__dirname, '../shared')];

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    configure: (webpackConfig, _arg) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName('babel-loader')
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat(packages);
      }
      return webpackConfig;
    },
  },
};
