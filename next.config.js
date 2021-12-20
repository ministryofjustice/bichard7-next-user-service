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
        destination: "/users",
        permanent: true,
        basePath: false
      },
      {
        source: "/users/login/v2",
        destination: "/users/login",
        permanent: true,
        basePath: false
      }
    ]
  }
}
