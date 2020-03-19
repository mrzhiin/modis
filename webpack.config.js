const path = require("path");
const Dotenv = require("dotenv-webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const fse = require("fs-extra");

const OUTPUT_PATH = path.resolve(__dirname, "dist");

const common = {
  mode: "production",
  entry: {
    main: "./src/index.ts"
  },
  output: {
    filename: `modis.min.js`,
    path: OUTPUT_PATH,
    library: `Modis`,
    libraryTarget: "umd",
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-sprite-loader",
            options: {
              symbolId: `modis-[name]`
            }
          },
          {
            loader: "svgo-loader",
            options: {
              plugins: [{ cleanupAttrs: true }]
            }
          }
        ]
      }
    ]
  },
  plugins: [new Dotenv(), new webpack.ProgressPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat"
    }
  }
};

const development = {
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8000,
    host: "0.0.0.0",
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "src/dev.html",
      inject: "head"
    })
  ]
};

const standard = {
  output: {
    filename: `modis.min.js`
  }
};

const slim = {
  output: {
    filename: `modis.slim.min.js`
  },
  externals: {
    "leancloud-storage": "AV"
  }
};

module.exports = (env = {}) => {
  if (env.production) {
    fse.removeSync(common.output.path);
    return [merge(common, standard), merge(common, slim)];
  } else {
    return merge(common, development);
  }
};
