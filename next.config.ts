export default {
  experimental: {
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy vehicle URL patterns from old enthusiastauto.com site
      // Webflow used /inventory/* or /vehicles-for-sale/* patterns
      {
        source: "/inventory/:slug",
        destination: "/vehicles/:slug",
        permanent: true, // 301 redirect
      },
      {
        source: "/vehicles-for-sale/:slug",
        destination: "/vehicles/:slug",
        permanent: true,
      },
      {
        source: "/inventory",
        destination: "/vehicles",
        permanent: true,
      },
      {
        source: "/vehicles-for-sale",
        destination: "/vehicles",
        permanent: true,
      },
      // Legacy product/parts URL patterns
      // Map old /shop or /products paths to new structure
      {
        source: "/shop/:handle",
        destination: "/product/:handle",
        permanent: true,
      },
      {
        source: "/products/:handle",
        destination: "/product/:handle",
        permanent: true,
      },
      {
        source: "/shop",
        destination: "/parts",
        permanent: true,
      },
      {
        source: "/products",
        destination: "/parts",
        permanent: true,
      },
      // Legacy account paths
      {
        source: "/my-account",
        destination: "/account",
        permanent: true,
      },
      {
        source: "/user/dashboard",
        destination: "/account",
        permanent: true,
      },
      // Legacy search paths
      {
        source: "/search-results",
        destination: "/search",
        permanent: true,
      },
    ];
  },
};
