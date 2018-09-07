module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.1.2:3000",
        changeOrigin: true
      }
    }
  }
}