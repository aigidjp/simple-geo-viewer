const isProd = process.env.BUILD_OPTION === 'production';

module.exports = {
  reactStrictMode: true,
  distDir: 'build',
  assetPrefix: isProd ? 'https://example.com/' : '.',
};
