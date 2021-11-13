/*import * as webpack from "webpack";

export default {
  node: {
    fs: "empty",
    Buffer: false,
    http: "empty",
    https: "empty",
    zlib: "empty",
  },
} as webpack.Configuration;*/
/*
https://github.com/CesiumGS/cesium/issues/8673
https://github.com/webpack/webpack/issues/198
https://github.com/CesiumGS/cesium-webpack-example/issues/6
https://github.com/CesiumGS/cesium-webpack-example/blob/master/webpack.config.js
*/

module.exports = {
  node: {
    // Resolve node module use of fs
    fs: "empty",
    Buffer: false,
    http: "empty",
    https: "empty",
    zlib: "empty"
  },
  module: {
    unknownContextRegExp: /$^/,
    unknownContextCritical: false,
  }
}
