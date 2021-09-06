module.exports = {
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
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; frame-src 'self'; frame-ancestors 'self'; form-action 'self'"
          },
          {
            key: "X-Content-Security-Policy",
            value: "default-src 'self'; frame-src 'self'; frame-ancestors 'self'; form-action 'self'"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          }
        ]
      }
    ]
  }
}
