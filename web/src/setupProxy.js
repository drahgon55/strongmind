const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/cars",
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: true,
      followRedirects: true
    })
  );
};
