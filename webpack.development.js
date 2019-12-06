const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8000,
    host: "0.0.0.0",
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({}),
    new HtmlWebpackPlugin({
      template: "src/dev.html",
      inject: "head"
    })
  ]
});
