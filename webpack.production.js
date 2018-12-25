const merge = require("webpack-merge");
const path = require("path");
const fse = require("fs-extra");
const common = require("./webpack.common");

fse.removeSync("dist");

const standard = merge(common, {
  mode: "production",
  output: {
    filename: `${process.env.npm_package_name}.min.js`,
    path: path.resolve(__dirname, "dist")
  }
});

const slim = merge(standard, {
  output: {
    filename: `${process.env.npm_package_name}.slim.min.js`
  },
  externals: {
    "leancloud-storage": "AV"
  }
});

module.exports = [standard, slim];
