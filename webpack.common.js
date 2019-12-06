const path = require("path");
const Dotenv = require("dotenv-webpack");

const OUTPUT_PATH = path.resolve(__dirname, "dist");

module.exports = {
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
        loader: "awesome-typescript-loader",
        exclude: /node_modules/
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
  plugins: [new Dotenv()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
};
