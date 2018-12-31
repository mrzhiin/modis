const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/index.js"
  },
  output: {
    filename: `modis.min.js`,
    path: path.resolve(__dirname, "dist"),
    library: `Modis`,
    libraryTarget: "umd",
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        resourceQuery: /blockType=i18n/,
        type: "javascript/auto",
        loader: "@kazupon/vue-i18n-loader"
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "vue-style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.postcss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "vue-style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
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
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
};
