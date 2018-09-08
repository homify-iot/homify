const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.1.2:3000",
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        'chart.js': 'chart.js/dist/Chart.js'
      }
    },
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
}