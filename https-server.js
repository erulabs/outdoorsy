process.env.NODE_ENV = 'production'
process.chdir(__dirname)
const https = require('https')
const path = require('path')
const fs = require('fs')
const NextServer = require('next/dist/server/next-server').default

// Make sure commands gracefully respect termination signals (e.g. from Docker)
process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

let handler

require('./api')

const server = https.createServer({
  key: fs.readFileSync(process.env.SSL_KEY_FILE),
  cert: fs.readFileSync(process.env.SSL_CRT_FILE),
})
const currentPort = parseInt(process.env.PORT, 10) || 3002

server.on('request', async (req, res) => {
  try {
    await handler(req, res)
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.end('internal server error')
  }
})
server.on('error', err => console.error(err))

server.listen(currentPort, err => {
  if (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
  const nextServer = new NextServer({
    hostname: 'outdoor.sy',
    port: currentPort,
    dir: path.join(__dirname),
    dev: false,
    conf: {
      env: {},
      webpackDevMiddleware: null,
      eslint: { ignoreDuringBuilds: false },
      typescript: { ignoreBuildErrors: false, tsconfigPath: 'tsconfig.json' },
      distDir: './.next',
      cleanDistDir: true,
      assetPrefix: process.env.BUILD_ASSET_PREFIX || '',
      configOrigin: 'next.config.js',
      useFileSystemPublicRoutes: true,
      generateEtags: true,
      pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
      target: 'server',
      poweredByHeader: false,
      compress: true,
      analyticsId: '',
      images: {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        path: '/_next/image',
        loader: 'default',
        domains: [
          'i.imgur.com',
          'api.producthunt.com',
          'github.com',
          'cdn.outdoor.sy',
          'artifacthub.io',
          'img.shields.io',
          'avatars.githubusercontent.com',
          'purecatamphetamine.github.io',
          'static.outdoor.sy',
          'api.outdoor.sy',
          'cdn.outdoor.sy',
        ],
        disableStaticImages: false,
        minimumCacheTTL: 120,
        formats: ['image/webp'],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
      },
      devIndicators: { buildActivity: true, buildActivityPosition: 'bottom-right' },
      onDemandEntries: { maxInactiveAge: 15000, pagesBufferLength: 2 },
      amp: { canonicalBase: '' },
      basePath: '',
      sassOptions: {},
      trailingSlash: false,
      i18n: null,
      productionBrowserSourceMaps: true,
      optimizeFonts: true,
      excludeDefaultMomentLocales: true,
      serverRuntimeConfig: {},
      publicRuntimeConfig: {},
      // reactStrictMode: true,
      httpAgentOptions: { keepAlive: true },
      outputFileTracing: true,
      staticPageGenerationTimeout: 60,
      swcMinify: true,
      experimental: {
        cpus: 4,
        sharedPool: true,
        plugins: false,
        profiling: false,
        isrFlushToDisk: true,
        workerThreads: true,
        pageEnv: false,
        optimizeCss: false,
        browsersListForSwc: true,
        legacyBrowsers: false,
        scrollRestoration: false,
        externalDir: false,
        reactRoot: false,
        disableOptimizedLoading: false,
        gzipSize: true,
        swcFileReading: true,
        craCompat: false,
        esmExternals: true,
        isrMemoryCacheSize: 52428800,
        serverComponents: false,
        fullySpecified: false,
        outputFileTracingRoot: '',
        outputStandalone: true,
        trustHostHeader: false,
      },
      configFileName: 'next.config.js',
    },
  })
  handler = nextServer.getRequestHandler()

  console.log('HTTPS Listening on port', currentPort)
})
