const merge = require("webpack-merge");
const path = require("path");
const fse = require("fs-extra");
const common = require("./webpack.common");

fse.removeSync("dist");

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
  }
});

module.exports = [standard, slim];
