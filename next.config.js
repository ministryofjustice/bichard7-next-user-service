module.exports = {
  basePath: "/users",
  webpack5: true,
  poweredByHeader: false,
  sassOptions: {
    quietDeps: true
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false
      }
    ]
  }
}
