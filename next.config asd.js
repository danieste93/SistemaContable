// next.config.js
const withPlugins = require('next-compose-plugins');

const withCSS = require('@zeit/next-css');

const path = require('path');
const withWorkbox = require("next-with-workbox");
const withImages = require('next-images')
const withSass = require('@zeit/next-sass')

const webpack = require("webpack")

module.exports = withPlugins(
 [
 

    [withImages,  { /* plugin config here ... */ }],
    [withWorkbox,  { /* plugin config here ... */ }],
   [withSass,  { /* plugin config here ... */ }],
  ],
  {

    reactStrictMode: true,
    env: {
      REACT_CLOUDY_APIKEY: process.env.REACT_CLOUDY_APIKEY,
      REACT_CLOUDY_SECRET: process.env.REACT_CLOUDY_SECRET,
      REACT_CLOUDY_CLOUDNAME: process.env.REACT_CLOUDY_CLOUDNAME,
    },


    webpack(config, options) {
        const { isServer } = options;
        config.module.rules.push({
          test: /\.(ogg|mp3|wav|mpe?g|svg)$/i,
          exclude: config.exclude,
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                limit: config.inlineImageLimit,
                fallback: require.resolve('file-loader'),
                publicPath: `${config.assetPrefix}/_next/static/images/`,
                outputPath: `${isServer ? '../' : ''}static/images/`,
                name: '[name]-[hash].[ext]',
                esModule: config.esModule || false,
              },
            },
          ],
          
          
        });

    
    
        return config;
      },
  },
);