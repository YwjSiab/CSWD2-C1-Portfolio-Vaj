const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  module: {
    rules: [
      // ✅ extract CSS into a real file
      { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader"] },
      // ✅ static assets
      { test: /\.(png|jpe?g|gif|ico|svg|mp3)$/i, type: "asset/resource" }
    ]
  },
plugins: [
  new HtmlWebpackPlugin({
    template: "./index.html",
    filename: "index.html",
    inject: "body"
  }),
  new HtmlWebpackPlugin({
    template: "./Projects.html",
    filename: "Projects.html",
    inject: "body"
  }),
  new HtmlWebpackPlugin({
    template: "./Resume.html",
    filename: "Resume.html",
    inject: "body"
  }),
  new HtmlWebpackPlugin({
    template: "./Contact.html",
    filename: "Contact.html",
    inject: "body"
  }),

  // ✅ This will output /dist/main.css
  new MiniCssExtractPlugin({
    filename: "main.css"
  }),

  // Copy non-bundled assets
  new CopyWebpackPlugin({
    patterns: [
      { from: "manifest.json", to: "." },
      { from: "serviceworker.js", to: "." },
      { from: "icon-192.png", to: "." },
      { from: "icon-512.png", to: "." },
      { from: "projects.json", to: "." },
      { from: "*.png", to: "." }
    ]
  })
],
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: true
  },
  mode: "development"
};