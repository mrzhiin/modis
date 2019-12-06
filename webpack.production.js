const merge = require("webpack-merge");
const fse = require("fs-extra");
const common = require("./webpack.common");

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
  }
});

module.exports = [standard, slim];
