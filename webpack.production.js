const merge = require("webpack-merge");
const fse = require("fs-extra");
const common = require("./webpack.common");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

fse.removeSync(common.output.path);

const standard = merge(common, {
  output: {
    filename: `modis.min.js`
  }
});

const slim = merge(standard, {
  output: {
    filename: `modis.slim.min.js`
  },
  externals: {
    "leancloud-storage": "AV"
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static"
    })
  ]
});

module.exports = [standard, slim];
