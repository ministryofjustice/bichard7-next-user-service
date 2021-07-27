module.exports = {
  future: {
    webpack5: true
  },
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
