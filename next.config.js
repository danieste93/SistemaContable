// next.config.js
const withPlugins = require('next-compose-plugins');

const withCSS = require('@zeit/next-css');

const path = require('path');
const withWorkbox = require("next-with-workbox");
const withImages = require('next-images')
//const withSass = require('@zeit/next-sass')
//const withSass = require('zeit-next-sass-modules');
const webpack = require("webpack")

module.exports = withPlugins(
 [
 
   [withCSS,  { /* plugin config here ... */ }],
    [withImages,  { /* plugin config here ... */ }],
    [withWorkbox,  { /* plugin config here ... */ }],
//[withSass,  { /* plugin config here ... */ }],
  ],
  {

    reactStrictMode: true,
    env: {
      REACT_CLOUDY_APIKEY: process.env.REACT_CLOUDY_APIKEY,
      REACT_CLOUDY_SECRET: process.env.REACT_CLOUDY_SECRET,
      REACT_CLOUDY_CLOUDNAME: process.env.REACT_CLOUDY_CLOUDNAME,
      IVA_EC : process.env.IVA_EC
    },


   
  },
);